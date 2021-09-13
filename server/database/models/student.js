module.exports = (sequelize, DataTypes) => {
  const student = sequelize.define(
    'student',
    {
      public_id: { type: DataTypes.UUID, unique: true, allowNull: false },
      first_name: { type: DataTypes.STRING },
      last_name: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING, unique: true },
      password: { type: DataTypes.STRING },
      mobile_number: { type: DataTypes.STRING, unique: true },
      address: { type: DataTypes.STRING },
      meeting_time: { type: DataTypes.DATE },
    },
    {
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    },
  );

  return student;
};
