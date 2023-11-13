import React from 'react';
import { useRef, useState } from 'react';
import '../css/conduct.css';
import useBodyClass from '../utils/BodyClass';

const guidelines = [
    {
      id: 1,
      header: "Respectful communication",
      text: "All users must engage in respectful, age-appropriate communication. Bullying, harassment, hate speech, or any form of discriminatory behavior will not be tolerated.",
    },
    {
      id: 2,
      header: "Privacy protection",
      text: "Users must not share personal information about themselves or others, such as addresses, phone numbers, or email addresses. Encourage the use of appropriate usernames to protect privacy.",
    },
    {
      id: 3,
      header: "No adult content",
      text: "Sharing, posting, or engaging with explicit or inappropriate content is strictly prohibited. This includes nudity, sexually suggestive content, graphic violence, or any content that is not suitable for the target age group. There is a moderation system in place that will prevent any unsafe content, however, if you spot an inappropiate image please report it.",
    },
    {
      id: 4,
      header: "Content restrictions",
      text: "Users should not post or share content that promotes self-harm, eating disorders, drug use, or any other harmful behavior. ",
    },
    {
      id: 5,
      header: "No impersonation",
      text: "Users must not pretend to be someone else, including impersonating public figures, celebrities, or other users.",
    },
    {
      id: 6,
      header: "Cyberbullying and harassment prevention",
      text: "Any form of cyberbullying or harassment is strictly forbidden. This includes targeting others based on their race, gender, religion, disability, or any other characteristic.",
    },
    {
      id: 7,
      header: "Parental involvement",
      text: "Encourage parents or guardians to be actively involved in their child's use of the platform and to monitor their child's online activity.",
    },
    {
      id: 8,
      header: "Reporting mechanisms",
      text: "Users should be aware of the platform's reporting and blocking features, and they should be encouraged to report any content or behavior that violates the community guidelines.",
    },
    {
      id: 9,
      header: "Copyright and intellectual property",
      text: "Users must respect others' intellectual property rights and only share content they have permission to use or that is within the public domain. Any post that is reported three times will be automatically delted",
    },
    {
      id: 10,
      header: "No spam or self-promotion",
      text: "Users should not use the platform to spam others, promote their own products or services, or engage in any form of unsolicited self-promotion.",
    },
    {
      id: 11,
      header: "Account security",
      text: "Users should be educated about the importance of keeping their login credentials secure and not sharing them with others.",
    },
  ];
  

const AccordionItem = ({ handleToggle, active, faq }) => {
  const contentEl = useRef(null);
  const { header, id, text } = faq;

  return (
    <div className="rc-accordion-card">
      <header
        className={active === id ? 'active' : ''}
        onClick={() => handleToggle(id)}
      >
        <h2>{header}</h2>
        <span className="material-symbols-outlined">expand_more</span>
      </header>
      <div
        ref={contentEl}
        className={`collapse ${active === id ? 'show' : ''}`}
        style={
          active === id
            ? { height: contentEl.current ? contentEl.current.scrollHeight : '0px' }
            : { height: '0px' }
        }
      >
        <p>{text}</p>
      </div>
    </div>
  );
};

export const Accordion = () => {
  const [active, setActive] = useState(null);
  useBodyClass('conduct-body');

  const handleToggle = (index) => {
    if (active === index) {
      setActive(null);
    } else {
      setActive(index);
    }
  };

  return (
    <div className='conduct-body'>
        <h1>Community Guidleines for Moments</h1>
        <article>
        {guidelines.map((faq, index) => (
            <AccordionItem
            key={index}
            active={active}
            handleToggle={handleToggle}
            faq={faq}
            />
        ))}
        </article>
    </div>
  );
};
