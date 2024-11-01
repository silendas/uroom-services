const { Op } = require("sequelize");

const getDefaultFilter = () => {
  return {
    where: {
      deleted: false
    },
    order: [["created_at", "DESC"]]
  };
};

const getSearchUser = (search) => {
  if (!search) return {};
  
  return {
    [Op.or]: [
      { email: { [Op.iLike]: `%${search}%` } }, 
      { name: { [Op.iLike]: `%${search}%` } }, 
      { username: { [Op.iLike]: `%${search}%` } }
    ]
  };
};

module.exports = {
  getDefaultFilter,
  getSearchUser
};
