const createBusiness = async (userId, businessData) => {
  const existingBusiness = await Business.findOne({ userId });

  if (existingBusiness) {
    throw new Error("Business already exists for this user.");
  }

  return await Business.create({
    ...businessData,
    userId,
  });
};

const getBusiness = async (userId) => {
  const business = await Business.findOne({ userId });

  if (!business) {
    throw new Error("Business profile not found.");
  }

  return business;
};

const updateBusiness = async (userId, businessData) => {
  const business = await Business.findOneAndUpdate({ userId }, businessData, {
    new: true,
    runValidators: true,
  });

  if (!business) {
    throw new Error("Business profile not found.");
  }

  return business;
};
