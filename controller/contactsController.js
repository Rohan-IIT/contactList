const { validationResult } = require('express-validator');
const contactsRepo = require('../src/contactsFileRepository');
const Contact = require('../src/Contact');

/* GET contacts listing. */
exports.contacts_list = function(req, res, next) {
    const data = contactsRepo.findAll();
    console.log("data =>",data);
    res.render('contacts', { title: 'Express Contacts', contacts: data } );
};
  
  /* GET contacts add */
  exports.contacts_create_get = function(req, res, next) {
    res.render('contacts_add', { title: 'Add contact'} );
  };
  
/* POST contacts add */
exports.contacts_create_post = function(req, res, next) {
    // Trim whitespace from form field values
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const email = req.body.email.trim();
    const notes = req.body.notes.trim();
    
    // Validate form input
    const result = validationResult(req);
    
    if (!result.isEmpty()) {
      res.render('contacts_add', {title: 'Add contact', msg: result.array()});
    } else {
      // Create a new contact object with trimmed values
      const newContact = new Contact('', firstName, lastName, email, notes);
      contactsRepo.create(newContact);
      res.redirect('/contacts');
    }
  };
  
  
  /* GET a contact */
  exports.contacts_detail = function(req, res, next) {
    const contact = contactsRepo.findById(req.params.uuid);
    if (contact) {
      res.render('contact', { title: 'Selected contact', contact: contact} );
    } else {
      res.redirect('/contacts');
    }
  };
  
  /* GET contacts delete */
  exports.contacts_delete_get = function(req, res, next) {
    const contact = contactsRepo.findById(req.params.uuid);
    res.render('contacts_delete', { title: 'Delete contact', contact: contact} );
  };
  
  /* POST contacts delete */
  exports.contacts_delete_post = function(req, res, next) {
    contactsRepo.deleteById(req.params.uuid);
    res.redirect('/contacts');
  };
  
  /* GET contacts edit */
  exports.contacts_edit_get = function(req, res, next) {
    const contact = contactsRepo.findById(req.params.uuid);
    console.log("loggging", contact);
    res.render('contacts_edit', { title: 'Edit contact', contact: contact} );
  };
  
  /* POST contacts edit */
  exports.contacts_edit_post = function(req, res, next) {
    //console.log(req.body);
    if ((req.body.firstName.trim() === '') || (req.body.lastName.trim() === '')) {
      const contact = contactsRepo.findById(req.params.uuid);
      res.render('contacts_edit', {title: 'Edit contact', msg: 'First name and Last name can not be empty!', contact: contact});
    } else {
      const updatedContact = new Contact(req.params.uuid, req.body.firstName, req.body.lastName, req.body.email, req.body.notes);
      contactsRepo.update(updatedContact);
      res.redirect('/contacts');
    }
  };