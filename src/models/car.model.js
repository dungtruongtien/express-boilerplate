export default function (sequelize, DataTypes) {
    const Car = sequelize.define('car', {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        brand: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        model: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false
        },
        seat: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        car_price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rent_price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        license_plate: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, { freezeTableName: true });


    Car.associate = (models) => {
        Car.Brands = Car.belongsTo(models.Brand, {
            foreignKey: 'brand',
            as: 'brandInfo'
        });

        Car.Models = Car.belongsTo(models.Model, {
            foreignKey: 'model',
            as: 'modelInfo'
        });
    };
    return Car;
}
