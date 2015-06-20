var bcrypt = require('bcrypt-nodejs')
  , config = require('./config.json')
  , knex = require('knex')(config.db)
  , bookshelf = require('bookshelf')(knex)
  , Users
  , UsersPreferences
  , UsersLogin
  , UsersBanned
  , UsersNotifications
  , Submissions
  , SubmissionsFiles
  , SubmissionsComments
  , UsersSubmissionsSaves
  , UsersSubmissionsVotes
  , Tags
  , SubmissionsTags
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
  preferences: function () {
    return this.hasOne(UsersPreferences, 'users_id');
  },
  login: function () {
    return this.hasOne(UsersLogin, 'users_id');
  },
  banned: function () {
    return this.hasOne(UsersBanned, 'users_id');
  },
  submissions: function () {
    return this.hasMany(Submissions, 'submissions_id');
  },
  submissionsVotes: function () {
    return this.hasMany(UsersSubmissionsVotes, 'submissions_id');
  },
  submissionsSaves: function () {
    return this.hasMany(UsersSubmissionsSaves, 'submissions_id');
  }
});

UsersPreferences = bookshelf.Model.extend({
  tableName: 'users_preferences',
  idAttribute: 'users_preferences_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  }
});

UsersLogin = bookshelf.Model.extend({
  tableName: 'users_login',
  idAttribute: 'users_login_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  }
});

UsersBanned = bookshelf.Model.extend({
  tableName: 'users_banned',
  idAttribute: 'users_banned_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  },
  bannedBy: function () {
    return this.belongsTo(Users, 'banned_by_users_id');
  }
});

UsersNotifications = bookshelf.Model.extend({
  tableName: 'users_notifications',
  idAttribute: 'users_notifications_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  },
  submission: function () {
    return this.belongsTo(Submissions, 'submissions_id');
  },
  comment: function () {
    return this.belongsTo(SubmissionsComments, 'submissions_comments_id');
  }
});

Submissions = bookshelf.Model.extend({
  tableName: 'submissions',
  idAttribute: 'submissions_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  },
  submissionsFiles: function () {
    return this.hasMany(SubmissionsFiles, 'submissions_files_id');
  },
  tags: function () {
    return this.hasMany(SubmissionsTags, 'submissions_id');
  }
});

SubmissionsFiles = bookshelf.Model.extend({
  tableName: 'submissions_files',
  idAttribute: 'submissions_files_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  },
  submission: function () {
    return this.belongsTo(Submissions, 'submissions_id');
  },
});

SubmissionsComments = bookshelf.Model.extend({
  tableName: 'submissions_comments',
  idAttribute: 'submissions_comments_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  },
  submission: function () {
    return this.belongsTo(Submissions, 'submissions_id');
  }
});

UsersSubmissionsSaves = bookshelf.Model.extend({
  tableName: 'users_submissions_saves',
  idAttribute: 'users_submissions_saves_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  },
  submission: function () {
    return this.belongsTo(Submissions, 'submissions_id');
  }
});

UsersSubmissionsVotes = bookshelf.Model.extend({
  tableName: 'users_submissions_votes',
  idAttribute: 'users_submissions_votes_id',
  user: function () {
    return this.belongsTo(Users, 'users_id');
  },
  submission: function () {
    return this.belongsTo(Submissions, 'submissions_id');
  }
});

Tags = bookshelf.Model.extend({
  tableName: 'tags',
  idAttribute: 'tags_id',
});

SubmissionsTags = bookshelf.Model.extend({
  tableName: 'submissions_tags',
  idAttribute: 'submissions_tags_id',
  submission: function () {
    return this.hasOne(Submissions, 'submissions_id');
  },
  tag: function () {
    return this.hasOne(Tags, 'tags_id');
  }
});

module.exports = {
  "Users": Users,
  "UsersPreferences": UsersPreferences,
  "UsersLogin": UsersLogin,
  "UsersBanned": UsersBanned,
  "UsersNotifications": UsersNotifications,
  "Submissions": Submissions,
  "SubmissionsFiles": SubmissionsFiles,
  "SubmissionsComments": SubmissionsComments,
  "UsersSubmissionsSaves": UsersSubmissionsSaves,
  "UsersSubmissionsVotes": UsersSubmissionsVotes,
  "Tags": Tags,
  "SubmissionsTags": SubmissionsTags
};