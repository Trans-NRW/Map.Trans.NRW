import Head from 'next/head';
import Logo from '@components/Logo';
import Footer from '@components/Footer';

import styles from './Layout.module.scss';

const Layout = ({ children, className, ...rest }) => {
  return (
    <div className={styles.layout}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Logo />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
