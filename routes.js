var _ = require('lodash');

module.exports = function (db) {

  return {

    // User Routes =============================================================

    getUser: function (req, res, next) {
      new db.Users({ username: req.params.username }).fetch()
        .then(function (data) {
          if (!data) return res.status(404).send("User does not exist!");
          var package = {
            usersData: {
              username: data.get('username'),
              id: data.get('users_id')
            }
          };
          return res.status(200).send(JSON.stringify(package));
//          return res.render('user', JSON.stringify(package));
        })
        .catch(function (error) {
          return res.status(500).send("Internal server error!");
        })
      ;
    },

    updateUser: function (req, res, next) {
      new db.Users({ username: req.params.username }).fetch()
        .then(function (data) {
          if (!data) return res.status(400).send("Could not update user!");

          if (req.body.password) {
            req.body.password = this.generateHash(req.body.password);
          }

          data.save(req.body, { method: 'update' })
            .then(function (update) {
              return res.status(200).send(update);
            })
            .catch(function (error) {
              return res.status(400).send("Could not update user!");
            })
          ;

        })
        .catch(function (error) {
          return res.status(500).send("Internal server error!");
        })
      ;
    },

    // Galleries Routes ========================================================

    getGalleries: function (req, res, next) {
      new db.Submissions().fetchAll()
        .then(function (submissions) {
          return res.status(200).send(submissions);
        })
        .catch(function (error) {
          return res.status(404).send("Could not get submissions!");
        })
      ;
    },

    getGallery: function (req, res, next) {
      new db.Submissions({ name: req.params.submission }).fetch()
        .then(function (submission) {
          return res.status(200).send(submission);
        })
        .catch(function (error) {
          return res.status(404).send("Could not get submission!");
        })
      ;
    },

    createGallery: function (req, res, next) {

      function makeSubmission (usersId) {
        var submissionsData = {
          "title": req.body.title,
          "anonymous": req.body.anonymous,
          "private": req.body.private,
        };

        if (usersId) submissionsData.users_id = usersId;

        new db.Submissions(submissionsData).save()
          .then(function (submissions) {

            function recursiveFileUpload (file) {
              var submissionsFileData = {
                "submissions_id": submissions.id,
                "size": file.size,
                "directory": file.path,
                "original_name": file.originalname,
                "name": file.name,
                "caption": req.body.caption,
                "upload_ip": req.ip
              };

              if (usersId) submissionsFileData.users_id = usersId;

              new db.SubmissionsFiles(submissionsFileData).save()
                .then(function (file) {
                  file = file.toJSON();
                  file.submission = submissions.get('name');
                  var nextFile = req.files.file.shift();
                  if (nextFile) {
                    recursiveFileUpload(nextFile);
                  }
                  else {
                    return res.status(200).end();
                  }
                })
                .catch(function (error) {
                  return res.status(404).send("Could not upload file!");
                })
              ;
            }

            recursiveFileUpload(req.files.file.shift());

          })
          .catch(function (error) {
            return res.status(404).send("Could not upload file!");
          })
        ;
      }

      if (req.body.anonymous === 'true') {
        makeSubmission();
      }
      else {
        new db.Users({ users_id: req.user.id }).fetch()
          .then(function (users) {
            makeSubmission(users.id);
          })
          .catch(function (error) {
            return res.status(404).send("Could not upload file!");
          })
        ;
      }

    },

    updateGallery: function (req, res, next) {
      new db.Submissions({ name: req.params.submission }).fetch()
        .then(function (submission) {

          if (!submission)
            return res.status(400).send("Could not update submission!");

          if (submission.get('users_id') === req.user.id) {
            submission.save(req.body, { method: 'update' })
              .then(function (update) {
                return res.status(200).send(update);
              })
              .catch(function (error) {
                return res.status(400).send("Could not update submission!");
              })
            ;
          }
          else {
            return res.status(500)
              .send("User not authorized to update submission!");
          }

        })
        .catch(function (error) {
          return res.status(500).send("Internal server error!");
        })
      ;
    },

    deleteGallery: function (req, res, next) {
      new db.Submissions({ name: req.params.submission }).fetch()
        .then(function (submission) {
          if (submission.get('users_id') === req.user.id) {
            submission.destroy()
              .then(function (success) {
                return res.status(200).end();
              })
              .catch(function (error) {
                return res.status(404).send("Could not delete submission!");
              })
            ;
          }
          else {
            return res.status(500)
              .send("User not authorized to delete submission!");
          }
        })
        .catch(function (error) {
          return res.status(500).send("Could not delete submission!");
        })
      ;
    },

    // Galleries Images Routes =================================================

    getGalleriesImages: function (req, res, next) {
      new db.SubmissionsFiles({ name: req.params.file })
        .fetch({ withRelated: ['submission'] })
        .then(function (file) {
          var submission = file.related('submission');
          if (submission.get('name') === req.params.submission) {
            return res.status(200).send(file);
          }
        })
        .catch(function (error) {
          return res.status(404).send("Could not get file!");
        })
      ;
    },

    getGalleriesImage: function (req, res, next) {
      new db.SubmissionsFiles({ name: req.params.submission })
        .fetchAll({ withRelated: ['submission'] })
        .then(function (files) {
          var submission = files.models[0].related('submission');
          if (submission.get('name') === req.params.submission) {
            return res.status(200).send(files.toJSON());
          }
        })
        .catch(function (error) {
          return res.status(404).send("Could not get file!");
        })
      ;
    },

    createGalleriesImage: function (req, res, next) {
      new db.Submissions({ name: req.params.submission }).fetch()
        .then(function (submissions) {
          if (submissions.get('users_id') === req.user.id) {

            var submissionsFileData = {
              "submissions_id": submissions.id,
              "users_id": submissions.get('users_id'),
              "size": req.files.file.size,
              "directory": req.files.file.path,
              "original_name": req.files.file.originalname,
              "name": req.files.file.name,
              "caption": req.body.caption,
              "upload_ip": req.ip
            };

            new db.SubmissionsFiles(submissionsFileData).save()
              .then(function (file) {
                file = file.toJSON();
                file.submission = submissions.get('name');
                return res.status(200).send(file);
              })
              .catch(function (error) {
                return res.status(404).send("Could not upload file!");
              })
            ;

          }
        })
        .catch(function (error) {
          return res.status(500).send("Could not upload file!");
        })
      ;
    },

    updateGalleriesImage: function (req, res, next) {
      new db.SubmissionsFiles({ name: req.params.file })
        .fetch({ withRelated: ['submission'] })
        .then(function (file) {
          var submission = file.related('submission');
          if (!file) {
            return res.status(400).send("File does not exist!");
          }
          else if (file.get('users_id') !== req.user.id) {
            return res.status(400).send("User not authorized");
          }
          else if (submission.get('name') !== req.params.submission) {
            return res.status(500).send("Internal server error!");
          }
          else {
            file.save(req.body, { method: 'update' })
              .then(function (update) {
                return res.status(200).send(update);
              })
              .catch(function (error) {
                return res.status(400).send("Could not update submission!");
              })
            ;
          }
        })
        .catch(function (error) {
          return res.status(500).send("Internal server error!");
        })
      ;
    },

    deleteGalleriesImage: function (req, res, next) {
      new db.SubmissionsFiles({ name: req.params.file })
        .fetch({ withRelated: ['submission'] })
        .then(function (file) {
          var submission = file.related('submission');
          if (!file) {
            return res.status(400).send("File does not exist!");
          }
          else if (file.get('users_id') !== req.user.id) {
            return res.status(400).send("User not authorized");
          }
          else if (submission.get('name') !== req.params.submission) {
            return res.status(500).send("Internal server error!");
          }
          else {
            file.destroy()
              .then(function (success) {
                return res.status(200).end();
              })
              .catch(function (error) {
                return res.status(400).send("Could not delete file!");
              })
            ;
          }
        })
        .catch(function (error) {
          return res.status(500).send("Internal server error!");
        })
      ;

    },

  };

};