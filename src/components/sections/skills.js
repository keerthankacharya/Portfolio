import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const scroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const StyledSkillsSection = styled.section`
  max-width: 100%;
  margin: 0 auto;
  padding: 100px 0;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 80px 0;
  }

  @media (max-width: 480px) {
    padding: 60px 0;
  }
`;

const StyledSkillsContainer = styled.div`
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(
    to right,
    transparent,
    white 20%,
    white 80%,
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    white 20%,
    white 80%,
    transparent
  );
`;

const StyledSkillsTrack = styled.div`
  display: flex;
  animation: ${scroll} 30s linear infinite;
  width: fit-content;
`;

const StyledSkillItem = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin-right: 2rem;
`;

const StyledSkillText = styled.span`
  font-family: var(--font-mono);
  font-size: var(--fz-md);
  color: var(--light-slate);
  margin-right: 1rem;

  @media (max-width: 768px) {
    font-size: var(--fz-sm);
  }
`;

const StyledSkillSeparator = styled.span`
  color: var(--green);
  font-size: var(--fz-sm);
`;

const Skills = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const skills = [
    'JavaScript (ES6+)',
    'TypeScript',
    'React.js',
    'Angular.js',
    'Next.js',
    'Tailwind CSS',
    'Node.js',
    'Express.js',
    'GraphQL',
    'MongoDB',
    'Docker',
    'Git',
    'GitHub',
    'Vercel',
    'REST APIs',
    'Figma',
    'OOPs',
    'Database Management',
    'Data Structures',
    'Operating Systems',
    'Computer Networks',
    'Agile',
    'CI/CD',
    'Firebase Auth',
    'MS Office'
  ];

  // Duplicate the skills array to create seamless infinite scroll
  const duplicatedSkills = [...skills, ...skills];

  return (
    <StyledSkillsSection id="skills" ref={revealContainer}>
      <StyledSkillsContainer>
        <StyledSkillsTrack>
          {duplicatedSkills.map((skill, index) => (
            <StyledSkillItem key={index}>
              <StyledSkillText>{skill}</StyledSkillText>
              <StyledSkillSeparator>✦</StyledSkillSeparator>
            </StyledSkillItem>
          ))}
        </StyledSkillsTrack>
      </StyledSkillsContainer>
    </StyledSkillsSection>
  );
};

export default Skills;
