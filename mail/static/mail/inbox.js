document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  
  // Clear out composition fields
  clearCompose();
  
  document.querySelector('#compose-form').onsubmit = function() {

    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
        load_mailbox('sent');
    });
    
    return false;
  }
}

// Clear out composition fields
function clearCompose() {
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch('/emails/'+mailbox)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

      emails.forEach(function(email) {
        const element = document.createElement('div');
        element.style.border = '1px solid black';
        element.style.padding = '10px 10px 0px 10px';
        
        if(!email.read === false) {
          element.style.backgroundColor = 'grey';
        }if(mailbox === 'sent') {
          element.style.backgroundColor = 'white';
        }

        const element_p = document.createElement('p');
        
        const element_email = document.createElement('span');
        element_email.style.fontWeight = 'bold';
        element_email.style.fontSize = '16px';
        element_email.style.marginRight = '10px';
        
        if(mailbox === 'sent') {
          element_email.innerHTML = email.recipients;
        } if(mailbox === 'inbox') {
          element_email.innerHTML = email.sender;
        } 

        const element_subject = document.createElement('span');
        element_subject.innerHTML = email.subject;

        const element_timestamp = document.createElement('span');
        element_timestamp.style.float = 'right';
        element_timestamp.innerHTML = email.timestamp;

        element_p.append(element_email, element_subject, element_timestamp)
        element.append(element_p)

        element.addEventListener('click', function() {
          console.log(email)
        });
        document.querySelector('#emails-view').append(element);
      })
      
  });
}