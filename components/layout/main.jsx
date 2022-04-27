import { Auth } from 'components/common/auth';
import Head from 'next/head';
import styles from './layout.module.css';

export default function Layout({ children }) {
    return (
        <Auth>
            <Head>
                <title>Layouts Example</title>
            </Head>
            <div>ANCD</div>
            <main className={styles.main}>{children}</main>
        </Auth>
    );
}
