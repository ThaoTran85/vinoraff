import axiosClient from 'api-client/axios-client';
import { EmptyLayout } from 'components/layout';
import { SWRConfig } from 'swr';
import { ConfigProvider, Table } from 'antd';
import locale from 'antd/lib/locale/vi_VN';
import 'styles/login.scss';

export default function MyApp({ Component, pageProps }) {
    const Layout = Component.Layout ?? EmptyLayout;
    return (
        <SWRConfig value={{ fetcher: (url) => axiosClient.get(url), shouldRetryOnError: false }}>
            <ConfigProvider locale={locale}>
                {/* <Provider store={store}> */}
                <Layout>
                    <Component {...pageProps} />
                </Layout>
                {/* </Provider> */}
            </ConfigProvider>
        </SWRConfig>
    );
}
