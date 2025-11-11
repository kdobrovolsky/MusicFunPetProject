import {type ChangeEvent, useState} from "react";
import {useFetchPlaylistsQuery} from "@/features/playlists/api/playlistsApi.ts";
import s from './PlaylistsPage.module.css'
import {useDebounceValue} from "@/common/hooks";
import {Pagination} from "@/common/components";
import {PlaylistsList} from "@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistsList.tsx";


export const PlaylistsPage = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(2)

    const [search, setSearch] = useState('')
    const debounceSearch = useDebounceValue(search)

    const { data, isLoading,} = useFetchPlaylistsQuery({
        search: debounceSearch,
        pageNumber: currentPage,
        pageSize,
    })

    // if(error){
    //     if('status' in error){
    //      const errMsg = 'error' in error ? error.error : ((error.data as {error:string}).error) || ((error.data as {message:string}).message) || 'Some Error occurred'
    //         toast(errMsg, {type: 'error', theme: 'colored'})
    //     }else {
    //         const errMsg = error.message || 'Some Error occurred'
    //         toast(errMsg, {type: 'error', theme: 'colored'})
    //     }
    // }

    const changePageSizeHandler = (size: number) => {
        setPageSize(size)
        setCurrentPage(1)
    }

    const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value)
        setCurrentPage(1)
    }

    if(isLoading) {
        return <h1>Skeleton loader..</h1>
    }

    return (
        <div className={s.container}>
            <h1>Playlists page</h1>

            <input
                type="search"
                placeholder={'Search playlist by title'}
                onChange={searchPlaylistHandler}
            />
            <PlaylistsList playlists={data?.data || []} isPlaylistsLoading={isLoading} />
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pagesCount={data?.meta.pagesCount || 1}
                pageSize={pageSize}
                changePageSize={changePageSizeHandler}
            />
        </div>
    )
}