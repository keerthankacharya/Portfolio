import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { srConfig, email } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledContactSection = styled.section`
  max-width: 600px;
  margin: 0 auto 100px;
  text-align: center;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
  }

  .overline {
    display: block;
    margin-bottom: 20px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: 400;

    &:before {
      bottom: 0;
      font-size: var(--fz-sm);
    }

    &:after {
      display: none;
    }
  }

  .title {
    font-size: clamp(40px, 5vw, 60px);
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 50px;
  text-align: left;

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  label {
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
  }

  input, textarea {
    background-color: var(--light-navy);
    color: var(--lightest-slate);
    border: 1px solid var(--lightest-navy);
    border-radius: 4px;
    padding: 12px;
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    transition: var(--transition);

    &:focus {
      outline: none;
      border-color: var(--green);
    }
  }

  textarea {
    min-height: 150px;
    resize: vertical;
  }

  button {
    ${({ theme }) => theme.mixins.bigButton};
    margin: 20px auto 0;
    align-self: center;
    display: block;
  }
`;

const Contact = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      
      // Only update if the input is empty or contains only digits
      if (digitsOnly === '' || /^\d+$/.test(digitsOnly)) {
        // Limit to 10 digits
        const truncatedValue = digitsOnly.slice(0, 10);
        setFormData(prev => ({
          ...prev,
          [name]: truncatedValue
        }));
        
        // Set error message if not exactly 10 digits
        setPhoneError(truncatedValue.length === 10 ? '' : 'Phone number must be 10 digits');
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number before submission
    if (formData.phone.length !== 10) {
      setPhoneError('Phone number must be 10 digits');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const payload = {
        access_key: 'e265de45-5e6b-449e-8eb6-474a4636db8c',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        subject: 'New Contact Form Submission',
        from_name: formData.name,
        reply_to: formData.email
      };

      console.log('Sending form data:', payload);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('Web3Forms response:', result);

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: '✅ Message Sent! Thanks for getting in touch! Your message is now on its way — probably hitching a ride on a Wi-Fi signal.📡 I’ll reply soon (unless I’m debugging… then I’ll reply slightly later 😅).'
        });
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: ''
        });
        setPhoneError('');
      } else {
        console.error('Form submission failed:', result);
        setSubmitStatus({
          type: 'error',
          message: `Submission failed: ${result.message || 'Unknown error'}`
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: `Error: ${error.message || 'Something went wrong. Please try again later.'}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">What's Next?</h2>

      <h2 className="title">Get In Touch</h2>

      <p>
        I'm currently looking for new opportunities. Whether you have a question or just want to say hi,
        I'll try my best to get back to you!
      </p>

      <StyledForm onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            pattern="[0-9]{10}"
            maxLength="10"
            placeholder="9999999999"
            required
          />
          {phoneError && <span style={{ color: 'var(--green)', fontSize: 'var(--fz-xs)' }}>{phoneError}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="jhondoe@xyz.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..."
            required
          />
        </div>

        {submitStatus.message && (
          <div style={{ 
            color: submitStatus.type === 'success' ? 'var(--green)' : 'var(--red)',
            fontSize: 'var(--fz-sm)',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {submitStatus.message}
          </div>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </StyledForm>
    </StyledContactSection>
  );
};

export default Contact;
