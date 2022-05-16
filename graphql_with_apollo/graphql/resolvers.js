const getPagination = (page, size) => {
  const limit = size ? +size : null;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

const getPagingData = (datas, page, limit) => {
  const { count: totalItems, rows: data } = datas;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return {
    totalItems,
    data,
    totalPages,
    currentPage,
  };
};

const resolvers = {
  Query: {
    userDetails: async (root, { id }, { models }) => {
      const [user, recipe] = await Promise.all([
        models.User.findByPk(id),
        models.Recipe.findAll({ where: { userId: id } }),
      ]);
      // const user = await models.User.findByPk(id);
      // const recipe = await models.Recipe.findAll({ where: { userId: id } });
      return { user: user, recipe: recipe };
    },
    allUsers: async (root, args, { models }) => {
      return models.User.findAll();
    },
    allRecipes: async (_, args, { models }) => {
      return models.Recipe.findAll();
    },
    getSomeUsers: async (_, { page, size }, { models }) => {
      try {
        const { limit, offset } = getPagination(page, size);
        const users = await models.User.findAndCountAll({ limit, offset });
        const data = getPagingData(users, page, limit);
        console.log(data);
        return data;
      } catch (err) {
        throw new Error(err);
      }
    },

    recipeDetails: async (root, { userId }, { models }) => {
      const recipe = await models.Recipe.findAll({
        where: { userId },
        raw: true,
      });
      console.log(recipe);
      const user = await models.User.findAll({
        where: { id: userId },
        raw: true,
      });
      console.log(user);
      return { user: user, recipe: recipe };
    },
  },

  Mutation: {
    createUser: async (root, { name, email, password }, { models }) => {
      const user = models.User.create({
        name,
        email,
        password,
      });
      return { user: user, msg: "Registered..!" };
    },

    createRecipe: async (
      root,
      { userId, title, ingredients, direction },
      { models }
    ) => {
      return models.Recipe.create({
        userId,
        title,
        ingredients,
        direction,
      });
    },
  },
  User: {
    async recipes(user, _, { models }) {
      console.log("user resolve field ", user.id);
      return await models.Recipe.findAll({ where: { userId: user.id } });
      //return user.getRecipes();
    },
  },
  Recipe: {
    async user(recipe) {
      return recipe.getUser();
    },
  },
};

module.exports = resolvers;
