export default function (sequelize, DataTypes) {
    const Model = sequelize.define('model', {
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
    }, { freezeTableName: true });

    Model.associate = (models) => {
        Model.Brand = Model.belongsTo(models.Brand, {
            foreignKey: 'brand_id',
            as: 'brand'
        });
    };
    return Model;
}
