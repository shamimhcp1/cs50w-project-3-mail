document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Clear the previous content in #content-view before adding new content
  document.querySelector('#content-view').innerHTML = '';

  // By default, load the inbox
  load_mailbox('inbox');
  // Store mailbox in local storage
  localStorage.setItem('mailbox', 'inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear the previous content in #content-view before adding new content
  document.querySelector('#content-view').innerHTML = '';
  
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

  // Store mailbox in local storage
  localStorage.setItem('mailbox', mailbox);
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#content-view').style.display = 'none';

  // Clear the previous content in #content-view before adding new content
  document.querySelector('#content-view').innerHTML = '';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch('/emails/'+mailbox)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

      emails.forEach(function(email) {
        const element = document.createElement('div');
        
        // If the email is unread or read
        if(!email.read === false) {
          element.style.backgroundColor = 'grey';
        }if(mailbox === 'sent') {
          element.style.backgroundColor = 'white';
        }

        const element_p = document.createElement('p');
        
        const element_email = document.createElement('span');
        element_email.style.fontWeight = 'bold';
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
            
            // mark the email as read
            fetch('/emails/'+email.id, {
              method: 'PUT',
              body: JSON.stringify({
                  read: true
              })
            })

            // from
            const content_p_from = document.createElement('p');
            const content_p_from_label = document.createElement('span');
            content_p_from_label.style.fontWeight = 'bold';
            content_p_from_label.style.marginRight = '10px';
            content_p_from_label.innerHTML = 'From:'
            const content_p_from_data = document.createElement('span');
            content_p_from_data.innerHTML = content.sender;
            content_p_from.append(content_p_from_label, content_p_from_data)
            // To
            const content_p_to = document.createElement('p');
            const content_p_to_label = document.createElement('span');
            content_p_to_label.style.fontWeight = 'bold';
            content_p_to_label.style.marginRight = '10px';
            content_p_to_label.innerHTML = 'To:'
            const content_p_to_data = document.createElement('span');
            content_p_to_data.innerHTML = content.recipients;
            content_p_to.append(content_p_to_label, content_p_to_data)
            // Subject
            const content_p_subject = document.createElement('p');
            const content_p_subject_label = document.createElement('span');
            content_p_subject_label.style.fontWeight = 'bold';
            content_p_subject_label.style.marginRight = '10px';
            content_p_subject_label.innerHTML = 'Subject:'
            const content_p_subject_data = document.createElement('span');
            content_p_subject_data.innerHTML = content.subject;
            content_p_subject.append(content_p_subject_label, content_p_subject_data)
            // timestamp
            const content_p_timestamp = document.createElement('p');
            const content_p_timestamp_label = document.createElement('span');
            content_p_timestamp_label.style.fontWeight = 'bold';
            content_p_timestamp_label.style.marginRight = '10px';
            content_p_timestamp_label.innerHTML = 'Timestamp:'
            const content_p_timestamp_data = document.createElement('span');
            content_p_timestamp_data.innerHTML = content.timestamp;
            content_p_timestamp.append(content_p_timestamp_label, content_p_timestamp_data)
            // reply or archived button
            const content_button_reply = document.createElement('button');
            content_button_reply.className = 'btn btn-sm btn-outline-primary mr-2'
            content_button_reply.innerHTML = 'Reply';
            content_button_reply.addEventListener('click', function() {
              console.log('reply')
            })
            // reply or Archive button
            const content_button_archived = document.createElement('button');
            content_button_archived.className = 'btn btn-sm btn-outline-primary'
            content_button_archived.innerHTML = 'Archive / Unarchive';
            content_button_archived.addEventListener('click', function() {
              console.log('archive')
            })
            // hr
            const content_hr = document.createElement('hr');
            // body
            const content_p_body = document.createElement('p');
            content_p_body.innerHTML = content.body;
            // append all element
            
            if(localStorage.getItem('mailbox') === 'inbox') {
              document.querySelector('#content-view').append(content_p_from, content_p_to, content_p_subject, content_p_timestamp, content_button_reply, content_button_archived, content_hr, content_p_body)
            } else {
              document.querySelector('#content-view').append(content_p_from, content_p_to, content_p_subject, content_p_timestamp, content_hr, content_p_body)
            }
            
          })

        });
        
      })
      
  });
}