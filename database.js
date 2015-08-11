var bcrypt = require('bcrypt-nodejs')
  , config = require('./config.json')
  , knex = require('knex')(config.db)
  , bookshelf = require('bookshelf')(knex)
  , Users
  , Galleries
  , GalleriesImages
;

var save = bookshelf.Model.prototype.save;
bookshelf.Model.prototype.save = function () {
  return save.apply(this, arguments).then(function (model) {
    return model ? model.fetch() : model;
  })
};

Users = bookshelf.Model.extend({
  tableName: 'users',
  idAttribute: 'users_id',
  generateHash: function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },
  validPassword: function (password) {
    return bcrypt.compareSync(password, this.get('password'));
  },
  galleries: function () {
    return this.hasMany(Submissions, 'galleries_id');
  }
});

Galleries = bookshelf.Model.extend({
  tableName: 'galleries',
  idAttribute: 'galleries_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  },
  galleriesImages: function () {
    return this.hasMany(GalleriesImages, 'galleries_images_id');
  }
});

GalleriesImages = bookshelf.Model.extend({
  tableName: 'galleries_images',
  idAttribute: 'galleries_images_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  },
  galleries: function () {
    return this.belongsTo(Galleries, 'galleries_id');
  },
});

module.exports = {
  "Users": Users,
  "Galleries": Galleries,
  "GalleriesImages": GalleriesImages,
};