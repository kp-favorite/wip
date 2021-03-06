/*jshint newcap:false*/

// Model.js
//------------------------------
//
// 2013-02-13, Jonas Colmsjö
//
// The Model object in the MVC model
//
// Documentation is 'docco style' - http://jashkenas.github.com/docco/
//
// Using Google JavaScript Style Guide - http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
//
//------------------------------


'use strict';

// .bind shim for IE8
if (!Function.prototype.bind) {
    Function.prototype.bind = function(context) {
        var self = this;
        return function() {
            return self.apply(context, arguments);
        };
    };
}

var TodoController = Stapes.subclass({
    'constructor' : function() {
        this.view = new TodoView();
        this.store = new TodoStore();
        this.model = new TodoModel( this.store.load() );

        this.bindEventHandlers();

        // Initial state from the URL
        this.set('state', this.view.getState());
    },

    'bindEventHandlers': function() {
        this.on({
            'change:state': function(state) {
                this.view.setActiveRoute(state);
                this.renderAll();
            }
        });

        this.model.on({
            'change' : function() {
                this.renderAll();
            },

            'change ready': function() {
                this.view.showClearCompleted( this.model.getComplete().length );
            }
        }, this);

        this.view.on({
            'clearcompleted': function() {
                this.model.clearCompleted();
            },

            'edittodo': function(id) {
                this.view.makeEditable(id);
            },

            'statechange': function(state) {
                this.set('state', state);
            },

            'todoadd': function(todo) {
                this.model.addTodo(todo);
                this.view.clearInput();
            },

            'tododelete': function(id) {
                this.model.remove(id);
            },

            'todocompleted todouncompleted': function(id, e) {
                this.model.update(id, function(item) {
                    item.completed = (e.type === 'todocompleted');
                    return item;
                });
            },

            'todoedit': function(data) {
                if (data.title === "") {
                    this.model.remove(data.id);
                } else {
                    this.model.update(data.id, function(item) {
                        item.title = data.title;
                        return item;
                    });
                }
            },

            'completedall uncompletedall': function(completedall, e) {
                this.model.update(function(item) {
                    item.completed = completedall;
                    return item;
                });
            }
        }, this);
    },

    renderAll: function() {
        this.store.save( this.model.getAll() );
        this.view.render( this.model.getItemsByState( this.get('state') ) );
        this.view.showLeft( this.model.getLeft().length );

        if ( this.model.size() > 0 ) {
            this.view.show();
        } else {
            this.view.hide();
        }
    }
});