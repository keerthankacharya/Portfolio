import { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledCertificationsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .certifications-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    grid-gap: 15px;
    position: relative;
    margin-top: 50px;

    @media (max-width: 1080px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }
`;

const StyledCertification = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .certification-inner {
        transform: translateY(-7px);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .certification-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
    overflow: auto;
  }

  .certification-image {
    width: 100%;
    height: 200px;
    margin-bottom: 10px;
    border-radius: var(--border-radius);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .certification-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);

    a {
      position: static;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .certification-description {
    color: var(--light-slate);
    font-size: 17px;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .certification-meta {
    display: flex;
    align-items: center;
    margin-top: 15px;
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    color: var(--green);

    svg {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }
  }
`;

const Certifications = () => {
  const data = useStaticQuery(graphql`
    query {
      certifications: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/certifications/" }
          frontmatter: { showInCertifications: { ne: false } }
        }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              issuer
              credentialId
              external
              cover {
                childImageSharp {
                  gatsbyImageData(width: 400, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
                }
              }
            }
            html
          }
        }
      }
    }
  `);

  const [showMore] = useState(false);
  const revealTitle = useRef(null);
  const revealCertifications = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealCertifications.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const GRID_LIMIT = 9;
  const certifications = data.certifications.edges.filter(({ node }) => node);
  const firstNine = certifications.slice(0, GRID_LIMIT);
  const certificationsToShow = showMore ? certifications : firstNine;

  const certificationInner = node => {
    const { frontmatter, html } = node;
    const { external, title, issuer, credentialId, cover } = frontmatter;
    const image = cover ? getImage(cover) : null;

    return (
      <div className="certification-inner">
        {image && (
          <div className="certification-image">
            <GatsbyImage image={image} alt={title} />
          </div>
        )}

        <header>
          <h3 className="certification-title">
            <a href={external} target="_blank" rel="noreferrer">
              {title}
            </a>
          </h3>

          <div className="certification-description" dangerouslySetInnerHTML={{ __html: html }} />
          {credentialId && (
            <div className="certification-meta" style={{ marginTop: '5px' }}>
              <span>Issuer: {issuer}</span>
            </div>
          )}
        </header>
      </div>
    );
  };

  return (
    <StyledCertificationsSection id="certifications">
      <h2 ref={revealTitle}>Certifications</h2>

      <ul className="certifications-grid">
        {prefersReducedMotion ? (
          <>
            {certificationsToShow &&
              certificationsToShow.map(({ node }, i) => (
                <StyledCertification key={i}>{certificationInner(node)}</StyledCertification>
              ))}
          </>
        ) : (
          <TransitionGroup component={null}>
            {certificationsToShow &&
              certificationsToShow.map(({ node }, i) => (
                <CSSTransition
                  key={i}
                  classNames="fadeup"
                  timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                  exit={false}>
                  <StyledCertification
                    key={i}
                    ref={el => (revealCertifications.current[i] = el)}
                    style={{
                      transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                    }}>
                    {certificationInner(node)}
                  </StyledCertification>
                </CSSTransition>
              ))}
          </TransitionGroup>
        )}
      </ul>
    </StyledCertificationsSection>
  );
};

export default Certifications;
