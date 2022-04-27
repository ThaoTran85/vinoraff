import * as React from 'react';
import useSWR from 'swr';

const MILLISECOND_PER_HOUSE = 60 * 60 * 1000;

export function PhieuYeuCauChiTiet({ id }) {
    const { data, error, mutate, isValidating } = useSWR(`/v1/PhieuYeuCaus/${id}`, {
        revalidateOnFocus: false, // tắt chức năng focus tab gọi API
        dedupingInterval: MILLISECOND_PER_HOUSE, // thời gian chờ để fetch lại API
    });

    function handleMutateClick() {
        // Dùng để xử lý cho việc thực thi data ngầm
        mutate({ name: 'loading...' }, true);
    }

    return (
        <div>
            Name: {data?.data.soPhieuYeuCau || '-- '}
            {console.log('data PhieuYeuCaus', data?.data.soPhieuYeuCau)}
            <button onClick={handleMutateClick}>Mutate</button>
        </div>
    );
}
