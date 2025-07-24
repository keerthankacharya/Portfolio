import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled, { css } from 'styled-components';
import { navLinks } from '@config';
import { loaderDelay } from '@utils';
import { useScrollDirection, usePrefersReducedMotion } from '@hooks';
import { Menu } from '@components';
import { IconLogo, IconHex } from '@components/icons';

const StyledHeader = styled.header`
  ${({ theme }) => theme.mixins.flexBetween};
  position: fixed;
  top: 0;
  z-index: 11;
  padding: 0px 60px;
  width: 100%;
  height: var(--nav-height);
  background-color: var(--navy);
  filter: none !important;
  pointer-events: auto !important;
  user-select: auto !important;
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px -8px rgba(2, 12, 27, 0.4);

  @media (max-width: 1080px) {
    padding: 0 50px;
  }
  @media (max-width: 768px) {
    padding: 0 30px;
  }
  @media (max-width: 480px) {
    padding: 0 20px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${props =>
    props.scrollDirection === 'up' &&
      !props.scrolledToTop &&
      css`
        height: var(--nav-scroll-height);
        transform: translateY(0px);
        background-color: var(--navy);
        backdrop-filter: blur(40px);
        -webkit-backdrop-filter: blur(40px);
        box-shadow: 0 8px 32px -12px rgba(2, 12, 27, 0.6);
      `};

    ${props =>
    props.scrollDirection === 'down' &&
      !props.scrolledToTop &&
      css`
        height: var(--nav-scroll-height);
        transform: translateY(calc(var(--nav-scroll-height) * -1));
        box-shadow: 0 8px 32px -12px rgba(2, 12, 27, 0.6);
      `};
  }
`;

const StyledNav = styled.nav`
  ${({ theme }) => theme.mixins.flexBetween};
  position: relative;
  width: 100%;
  color: var(--lightest-slate);
  font-family: var(--font-sans);
  isolation: isolate;
  z-index: 12;

  .logo {
    ${({ theme }) => theme.mixins.flexCenter};

    a {
      color: var(--green);
      width: 52px;
      height: 52px;
      position: relative;
      z-index: 1;
      border-radius: 12px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      .hex-container {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        opacity: 0.9;
        @media (prefers-reduced-motion: no-preference) {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
      }

      .logo-container {
        position: relative;
        z-index: 1;
        svg {
          fill: none;
          user-select: none;
          @media (prefers-reduced-motion: no-preference) {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          polygon {
            fill: var(--navy);
          }
        }
      }

      &:hover,
      &:focus {
        outline: 0;
        transform: translateY(-3px);
        .hex-container {
          opacity: 1;
          transform: scale(1.08);
        }
        .logo-container {
          transform: scale(1.08);
        }
      }
    }
  }
`;

const StyledLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }

  ol {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;
    gap: 4px;

    li {
      position: relative;
      font-size: var(--fz-sm);
      font-weight: 500;
      isolation: isolate;

      &::before {
        content: counter(nav-counter, decimal-leading-zero);
        counter-increment: nav-counter;
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        font-family: var(--font-mono);
        font-size: 10px;
        color: var(--green);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-weight: 400;
        z-index: 10;
        background: linear-gradient(
          135deg,
          rgba(10, 25, 47, 0.95) 0%,
          rgba(17, 34, 64, 0.9) 50%,
          rgba(10, 25, 47, 0.95) 100%
        );
        padding: 2px 6px;
        border-radius: 4px;
        border: 1px solid rgba(100, 255, 218, 0.3);
        pointer-events: none;
      }

      /* Number hover effect - only for the specific li being hovered */
      &:hover::before {
        opacity: 1 !important;
        transform: translateX(-50%) translateY(-2px) !important;
      }

      a {
        display: inline-block;
        padding: 14px 24px;
        color: var(--lightest-slate);
        text-decoration: none;
        border-radius: 12px;
        position: relative;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: var(--font-sans);
        letter-spacing: 0.8px;
        font-weight: 500;
        text-transform: uppercase;
        font-size: 13px;
        background: transparent;
        border: 1px solid transparent;
        overflow: hidden;
        z-index: 1;

        /* Reset any inherited styles */
        &::before,
        &::after {
          content: none;
        }

        /* Shimmer effect */
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.1), transparent);
          transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: -1;
        }
      }

      /* Hover state - only affects the specific link being hovered */
      a:hover {
        color: var(--green) !important;
        background: linear-gradient(135deg, rgba(100, 255, 218, 0.08), rgba(100, 255, 218, 0.03)) !important;
        border: 1px solid rgba(100, 255, 218, 0.15) !important;
        border-top: 1px solid transparent !important;
        transform: translateY(-2px) !important;
        outline: none !important;
        box-shadow: 0 6px 20px -6px rgba(100, 255, 218, 0.2) !important;
      }

      /* Shimmer animation on hover */
      a:hover::before {
        left: 100% !important;
      }

      /* Top border effect on hover */
      a:hover::after {
        content: '' !important;
        position: absolute !important;
        top: -1px !important;
        left: 0 !important;
        right: 0 !important;
        height: 1px !important;
        background: linear-gradient(
          to right,
          rgba(100, 255, 218, 0.15) 0%,
          rgba(100, 255, 218, 0.15) 40%,
          transparent 45%,
          transparent 55%,
          rgba(100, 255, 218, 0.15) 60%,
          rgba(100, 255, 218, 0.15) 100%
        ) !important;
        z-index: 2 !important;
      }

      /* Focus state */
      a:focus {
        color: var(--green) !important;
        background: linear-gradient(135deg, rgba(100, 255, 218, 0.08), rgba(100, 255, 218, 0.03)) !important;
        border: 1px solid rgba(100, 255, 218, 0.15) !important;
        border-top: 1px solid transparent !important;
        transform: translateY(-2px) !important;
        outline: none !important;
        box-shadow: 0 6px 20px -6px rgba(100, 255, 218, 0.2) !important;
      }

      a:focus::before {
        left: 100% !important;
      }

      /* Active state */
      a:active {
        transform: translateY(-1px) !important;
      }
    }
  }

  /* Counter reset for navigation numbering */
  counter-reset: nav-counter;
`;

const Nav = ({ isHome }) => {
  const [isMounted, setIsMounted] = useState(!isHome);
  const scrollDirection = useScrollDirection('down');
  const [scrolledToTop, setScrolledToTop] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleScroll = () => {
    setScrolledToTop(window.pageYOffset < 50);
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const timeout = isHome ? loaderDelay : 0;
  const fadeClass = isHome ? 'fade' : '';
  const fadeDownClass = isHome ? 'fadedown' : '';

  const Logo = (
    <div className="logo" tabIndex="-1">
      {isHome ? (
        <a href="/" aria-label="home">
          <div className="hex-container">
            <IconHex />
          </div>
          <div className="logo-container">
            <IconLogo />
          </div>
        </a>
      ) : (
        <Link to="/" aria-label="home">
          <div className="hex-container">
            <IconHex />
          </div>
          <div className="logo-container">
            <IconLogo />
          </div>
        </Link>
      )}
    </div>
  );

  return (
    <StyledHeader scrollDirection={scrollDirection} scrolledToTop={scrolledToTop}>
      <StyledNav>
        {prefersReducedMotion ? (
          <>
            {Logo}

            <StyledLinks>
              <ol>
                {navLinks &&
                  navLinks.map(({ url, name }, i) => (
                    <li key={i}>
                      <Link to={url}>{name}</Link>
                    </li>
                  ))}
              </ol>
            </StyledLinks>

            <Menu />
          </>
        ) : (
          <>
            <TransitionGroup component={null}>
              {isMounted && (
                <CSSTransition classNames={fadeClass} timeout={timeout}>
                  <>{Logo}</>
                </CSSTransition>
              )}
            </TransitionGroup>

            <StyledLinks>
              <ol>
                <TransitionGroup component={null}>
                  {isMounted &&
                    navLinks &&
                    navLinks.map(({ url, name }, i) => (
                      <CSSTransition key={i} classNames={fadeDownClass} timeout={timeout}>
                        <li key={i} style={{ transitionDelay: `${isHome ? i * 100 : 0}ms` }}>
                          <Link to={url}>{name}</Link>
                        </li>
                      </CSSTransition>
                    ))}
                </TransitionGroup>
              </ol>


            </StyledLinks>

            <TransitionGroup component={null}>
              {isMounted && (
                <CSSTransition classNames={fadeClass} timeout={timeout}>
                  <Menu />
                </CSSTransition>
              )}
            </TransitionGroup>
          </>
        )}
      </StyledNav>
    </StyledHeader>
  );
};

Nav.propTypes = {
  isHome: PropTypes.bool,
};

export default Nav;
