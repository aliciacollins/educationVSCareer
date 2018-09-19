module.exports = function(sequelize, DataTypes) {
  var jobs = sequelize.define("jobs", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    occupationTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    abbreviatedName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    employment2016Thousands: {
      type: DataTypes.STRING,
      allowNull: false
    },
    employment2026Thousands: {
      type: DataTypes.STRING,
      allowNull: false
    },
    employmentChange20162026Percent: {
      type: DataTypes.STRING,
      allowNull: false
    },
    occupationalOpenings20162026AnnualAverageThousands: {
      type: DataTypes.STRING,
      allowNull: false
    },
    medianAnnualWage: {
      type: DataTypes.STRING,
      allowNull: false
    },
    asCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    typicalEntryLevelEducation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    educationCode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    workExperienceInARelatedOccupation: DataTypes.STRING,
    workExCode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    TypicalOnTheJobTraining: {
      type: DataTypes.STRING,
      allowNull: false
    },
    trCode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  return jobs;
};
