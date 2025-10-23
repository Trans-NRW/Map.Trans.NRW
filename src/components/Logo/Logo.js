import styles from './Logo.module.scss';

const Logo = () => {
  return (
    <div className={styles.logoContainer}>
      <a 
        href="https://trans.nrw/" 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.logo}
        aria-label="Visit Trans.NRW website"
      >
        <img 
          src="/logo/logo.png" 
          alt="Trans.NRW Logo" 
          className={styles.logoImage}
        />
      </a>
      <div className={styles.footerContent}>
        <a 
          href="https://trans.nrw/" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.link}
          aria-label="Visit Trans.NRW website"
        >
          https://Trans.NRW
        </a>
        <span className={styles.separator}>|</span>
        <a 
          href="mailto:Admin@Trans.NRW" 
          className={styles.link}
          aria-label="Contact Admin at Trans.NRW"
        >
          Admin@Trans.NRW
        </a>
      </div>
    </div>
  );
};

export default Logo;
