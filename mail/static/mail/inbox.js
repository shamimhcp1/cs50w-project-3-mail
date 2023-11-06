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
  document.querySelector('#content-view').style.display = 'none';

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
        
        // If the email is unread or read
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

        // subject retrive
        const element_subject = document.createElement('span');
        element_subject.innerHTML = email.subject;

        // timestamp retrive
        const element_timestamp = document.createElement('span');
        element_timestamp.style.float = 'right';
        element_timestamp.innerHTML = email.timestamp;

        element_p.append(element_email, element_subject, element_timestamp)
        element.append(element_p)
        document.querySelector('#emails-view').append(element);

        // When a user clicks on an email
        element.addEventListener('click', function() {
  
          // Show the mailbox and hide other views
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'none';
          document.querySelector('#content-view').style.display = 'block';

          fetch('/emails/'+email.id)
          .then(response => response.json())
          .then(content => {
            
            console.log(content);

            const content_p_from = document.createElement('p');
            const content_p_to = document.createElement('p');
            
            const content_p_subject = document.createElement('p');
            const content_p_subject_label = document.createElement('span');
            content_p_subject_label.style.fontWeight = 'bold';
            content_p_subject_label.style.marginRight = '10px';
            content_p_subject_label.innerHTML = 'Subject:'
            const content_p_subject_data = document.createElement('span');
            content_p_subject_data.innerHTML = content.subject;
            content_p_subject.append(content_p_subject_label, content_p_subject_data)

            const content_p_timestamp = document.createElement('p');
            const content_p_timestamp_label = document.createElement('span');
            content_p_timestamp_label.style.fontWeight = 'bold';
            content_p_timestamp_label.style.marginRight = '10px';
            content_p_timestamp_label.innerHTML = 'Timestamp:'
            const content_p_timestamp_data = document.createElement('span');
            content_p_timestamp_data.innerHTML = content.timestamp;
            content_p_timestamp.append(content_p_timestamp_label, content_p_timestamp_data)

            const content_button_reply = document.createElement('button');
            content_button_reply.className = 'btn btn-sm btn-outline-primary'
            content_button_reply.innerHTML = 'Reply';
            content_button_reply.addEventListener('click', function() {
              console.log(content.id)
            })
            
            const content_hr = document.createElement('hr');
            const content_p_body = document.createElement('p');
            content_p_body.innerHTML = content.body;

            document.querySelector('#content-view').append(content_p_from, content_p_to, content_p_subject, content_p_timestamp, content_button_reply, content_hr, content_p_body)
          })

        });
        
      })
      
  });
}