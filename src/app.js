'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const postRoutes = require('./routes/postRoutes');
const postLikeRoutes = require('./routes/postLikeRoutes');
const replyRoutes = require('./routes/replyRoutes');
const auth = require('./middleware/auth');
const notFound = require('./handler/notFoundHandler');
const errorHandler = require('./handler/errorHandler');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));

// Tidak memerlukan autentikasi
app.use('/auth', authRoutes);

// Routes dengan autentikasi
app.use('/users', auth, userRoutes);
app.use('/posts', auth, postRoutes);
app.use('/post-likes', auth, postLikeRoutes);
app.use('/replies', auth, replyRoutes);

// Home Routes
app.use('/', homeRoutes);

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'U-ROOM Service API Documentation',
      version: '1.0.0',
      description: 'API documentation for U-ROOM',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
        ? process.env.PROD_URL
        : `http://localhost:${config.port}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Pastikan path ini benar
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Middleware untuk rute yang tidak ada
app.use(notFound);

// Middleware untuk error handling
app.use(errorHandler);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Sync database and start server
sequelize.sync({ force: false }).then(() => {
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
});
