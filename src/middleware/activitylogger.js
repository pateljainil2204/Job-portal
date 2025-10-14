import Activity from "../model/activitymodel.js";

const logActivity = async (userId, action) => {
  try {
    await Activity.create({
      user: userId,
      action,
      createdAt: new Date()
    });
  } catch (error) {
    console.error("Activity Logger Error:", error.message);
  }
};

export default logActivity;