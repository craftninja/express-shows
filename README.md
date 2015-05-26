# README

### How I made this:

1. basic app setup - create new app using express generator, and make initial commit
  * $ express shows
  * $ cd shows
  * $ git init
  * $ git add -A
  * $ git commit
1. npm install - install but do not commit to git
  * $ npm install
  * $ vim .gitignore
    * content: `node_modules/**`
  * open project in text editor
  * add README.md and outline all steps, and continue updating
  * $ git add -N .gitignore README.md
  * $ git add -p
  * $ git commit
1. App is bootstrapped
  * start server (and stop and restart with each code change and browser check)
    * `DEBUG=shows:* npm start`
    * no need to restart if you just change `.jade` files?
  * add bootstrap files
    * download bootstrap zip
    * unzip files
    * rename bootstrap top directory simply `bootstrap`
    * move entire bootstrap directory into public directory
  * require bootstrap in `views/layout.jade`
    * entire contents of `<head>` should now be:

      ```
      title= title
      link(rel='stylesheet', href='/bootstrap/css/bootstrap.min.css')
      link(rel='stylesheet', href='/bootstrap/css/bootstrap-responsive.min.css')
      link(rel='stylesheet', href='/stylesheets/style.css')
      script(src='http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js')
      script(src='/bootstrap/js/bootstrap.min.js')
      ```

  * Change general project title to "Shows"
    * in `routes/index.js` change `{title: 'Express'}` to `{title: 'Shows'}`
    * be sure to stop and start your server to verify change in browser
  * Commit only the bootstrap directory
  * Commit the rest of the files in a separate commit
1. User can see list of shows on index page - add mongoose, model for shows, insert one show into database using console
  * Express created a users route we will not use. In `app.js`, change:
    * `var users = require('./routes/users');` to `var showRoutes = require('./routes/shows');`
    * `app.use('/users', users);` to `app.use('/shows', showRoutes);`
  * rename `routes/users.js` to `routes/shows.js`
  * add mongoose, model for shows
    * to `package.json` add to dependencies `"mongoose": "~4.0.3",`
    * $ npm install
    * in `app.js` add above `view engine setup`:

      ```
      var mongoConnection = function () {
        var options = {server: {socketOptions: {keepAlive: 1}}};
        mongoose.connect('mongodb://localhost/shows', options);
      };
      mongoConnection();

      mongoose.connection.on('error', console.log);
      mongoose.connection.on('disconnected', mongoConnection);
      ```

    * in same file under the top requires, add `var mongoose = require('mongoose');`
    * in the same file, above routes add `var show = require('./app/models/show');`
    * add file `/app/models/show.js` with the content:

      ```
      var mongoose = require('mongoose');

      var Schema = mongoose.Schema;

      var ShowSchema = new Schema({
        title: {type: String, default: ''},
        seasons: {type: Number, default: 0},
        watched: {type: Boolean, default: false}
      });

      mongoose.model('Show', ShowSchema);
      ```
  * Access this model in the index and pass objects to the view
    * in `routes/shows.js`:
      * add `var mongoose = require('mongoose');` under other require
      * add access to the model under router declaration: `var Show = mongoose.model('Show');`
    * find all shows in the database and pass them into the view

      ```
      router.get('/', function(req, res, next) {
        Show.find({}, function(err, shows) {
          if (err) return console.log(err);
          res.render('shows/index', {shows: shows})
        });
      });
      ```
  * Use the shows variable passed into the view to list all shows on the index
    * add `view/shows/index.jade` with the following content:

      ```
      extends ../layout

      block content
        h1(class="page-header") My Shows

        ul(class="list-group")
          each show in shows
            if show.watched
              li(class="list-group-item") #{show.title} (Seasons: #{show.seasons}) - watched
            else
              li(class="list-group-item") #{show.title} (Seasons: #{show.seasons}) - unwatched
      ```

  * Add a link from root page to show index
    * `a(href='/shows') Check out these shows!`
  * create the mongo database and add one show:

    ```
    $ mongo
    MongoDB shell version: 3.0.3
    connecting to: test
    > use show
    switched to db show
    > db.shows
    show.shows
    > db.show.insert({title: "Secrets and Lies", seasons: 1, watched: true})
    WriteResult({ "nInserted" : 1 })
    ```
  * Commit
1. User can see a show's show page
  * Add link to index

    ```
    if show.watched
      li(class="list-group-item")
        a(href="shows/" + show.id) #{show.title} (Seasons: #{show.seasons}) - watched
    else
      li(class="list-group-item")
        a(href="shows/" + show.id) #{show.title} (Seasons: #{show.seasons}) - unwatched
    ```

  * Add route to `routes/shows.js`

    ```
    router.get('/:id', function(req, res, next) {
      Show.findOne({_id: req.params.id}, function(err, show) {
        if (err) return console.log(err);
        res.render('shows/show', {show: show});
      });
    });
    ```

  * Add view `views/shows/show.jade`

    ```
    extends ../layout

    block content
      h1(class="page-header")= show.title

      ol(class="breadcrumb")
        li
          a(href="/shows") My Shows
        li(class="active")= show.title

      if show.watched
        p Seasons: #{show.seasons} - watched
      else
        p Seasons: #{show.seasons} - unwatched
    ```

  * Check in browser (after restarting the server) and commit
1. User can add new shows
  * Add a "New Show" button to index

    ```
    div(class="page-header")
      a(href='shows/new' class="btn btn-success pull-right") Add New Show
      h1 My Shows
    ```

  * Add a new route to `routes/shows.js`

    ```
    router.get('/new', function(req, res, next) {
      res.render('shows/new');
    });
    ```

  * Add view `view/shows/new.jade`

    ```
    extends ../layout

    block content

      h1(class="page-header") New Show

      ol(class="breadcrumb")
        li
          a(href="/shows") My Shows
        li(class="active") New Show

      form(action='/shows' method='post' class="form-horizontal")

        div(class="form-group")
          label(class="col-sm-2 control-label") Title
          div(class="col-sm-5")
            input(type='text' name='show[title]' class="form-control")

        div(class="form-group")
          label(class="col-sm-2 control-label") Number of Seasons
          div(class="col-sm-5")
            input(type='number' name='show[seasons]' class="form-control")

        div(class="form-group")
          div(class="col-sm-offset-2 col-sm-5")
            div(class="checkbox")
            label Have you watched this show?
              input(type='checkbox' name='show[watched]' class="form-control")

        div(class="form-group")
          div(class="col-sm-offset-2 col-sm-10")
            input(type='submit' name='commit' value='Add Show' class="btn btn-success")
    ```

  * Add update route

    ```
    router.post('/', function(req, res, next) {
      show = new Show({
        title: req.body['show[title]'],
        seasons: req.body['show[seasons]'],
        watched: req.body['show[watched]']
      });
      show.save(function (err, show) {
        if (err) return console.error(err);
        res.redirect('shows/' + show.id);
      });
    });
    ```

  * Restart server, verify in browser, commit all changes
1. User can update shows
  * Add edit button to show's show page

    ```
    div(class="page-header")
      a(href='/shows/' + show.id + '/edit' class='btn btn-success pull-right') Edit show
      h1= show.title
    ```

  * Add edit route

    ```
    router.get('/:id/edit', function(req, res, next) {
      Show.findOne({_id: req.params.id}, function(err, show) {
        if (err) return console.log(err);
        res.render('shows/edit', {show: show});
      });
    });
    ```

  * Add edit view

    ```
    extends ../layout

    block content

      h1(class="page-header") Edit #{show.title}

      ol(class="breadcrumb")
        li
          a(href="/shows") My Shows
        li
          a(href="/shows/" + show.id)= show.title
        li(class="active") Edit

      form(action='/shows/' + show.id method='post' class="form-horizontal")

        div(class="form-group")
          label(class="col-sm-2 control-label") Title
          div(class="col-sm-5")
            input(type='text' name='show[title]' value='#{show.title}' class="form-control")

        div(class="form-group")
          label(class="col-sm-2 control-label") Number of Seasons
          div(class="col-sm-5")
            input(type='number' name='show[seasons]' value='#{show.seasons}' class="form-control")

        div(class="form-group")
          div(class="col-sm-offset-2 col-sm-5")
            div(class="checkbox")
            label Have you watched this show?
              if show.watched
                input(type='checkbox' name='show[watched]' checked='#{show.watched}' class="form-control")
              else
                input(type='checkbox' name='show[watched]' class="form-control")

        div(class="form-group")
          div(class="col-sm-offset-2 col-sm-10")
            input(type='submit' name='commit' value='Update Show' class="btn btn-success")
    ```

  * Add update route

    ```
    router.post('/:id', function(req, res, next) {
      Show.findOne({_id: req.params.id}, function(err, show) {
        if (err) return console.log(err);
        show.title = req.body['show[title]'];
        show.seasons = req.body['show[seasons]'];
        show.watched = req.body['show[watched]'];
        show.save(function (err, show) {
          if (err) return console.error(err);
          res.redirect('/shows/' + show.id);
        })
      });
    });
    ```

  * Restart server, verify in browser, commit all changes
1. User can delete shows
  * Add a delete button to show's edit page

    ```
    div(class="page-header")
      a(href='/shows/' + show.id + '/delete' class="btn btn-danger pull-right") Delete show
      h1 Edit #{show.title}
    ```

  * Add a delete route

    ```
    router.get('/:id/delete', function(req, res, next) {
      Show.findOne({_id: req.params.id}, function(err, show) {
        if (err) return console.log(err);
        show.remove();
        res.redirect('/shows');
      });
    });
    ```

  * Restart server, verify in browser, commit all changes
