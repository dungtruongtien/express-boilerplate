export default function (sequelize, DataTypes) {
    const Brand = sequelize.define('brand', {
        id: {
            type: DataTypes.STRING,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, { freezeTableName: true, timestampz: false });

    Brand.associate = (models) => {
        Brand.Car = Brand.hasMany(models.Car, {
            foreignKey: 'brand',
            as: 'cars'
        });
    };

    return Brand;
}
