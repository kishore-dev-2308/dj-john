/**
 * DJ John - Main Application Controller
 * Handles UI interactions, mobile drawer navigation, smooth scroll, and contact actions.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Dynamic Footer Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Mobile Drawer Navigation Toggle
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuIcon = document.getElementById('menuIcon');

  if (menuBtn && mobileMenu && menuIcon) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      if (mobileMenu.classList.contains('hidden')) {
        menuIcon.className = 'fa-solid fa-bars text-xl';
      } else {
        menuIcon.className = 'fa-solid fa-xmark text-xl text-brand-yellow';
      }
    });

    document.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuIcon.className = 'fa-solid fa-bars text-xl';
      });
    });
  }

  // 3. Header Scroll Visual Elevation
  const mainHeader = document.getElementById('mainHeader');
  if (mainHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        mainHeader.classList.add('shadow-2xl', 'bg-brand-dark/95', 'backdrop-blur-xl');
      } else {
        mainHeader.classList.remove('shadow-2xl', 'bg-brand-dark/95', 'backdrop-blur-xl');
      }
    });
  }
});
