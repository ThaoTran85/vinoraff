import * as React from 'react';
import useSWR from 'swr';

const MILLISECOND_PER_HOUSE = 60 * 60 * 1000;

export function StudentDetail({ studentId }) {
    const { data, error, mutate, isValidating } = useSWR(`/students/${studentId}`, {
        revalidateOnFocus: false, // tắt chức năng focus tab gọi API
        dedupingInterval: MILLISECOND_PER_HOUSE, // thời gian chờ để fetch lại API
    });

    function handleMutateClick() {
        // Dùng để xử lý cho việc thực thi data ngầm
        mutate({ name: 'loading...' }, true);
    }

    return (
        <div>
            Name: {data?.name || '-- '}
            <button onClick={handleMutateClick}>Mutate</button>
        </div>
    );
}
