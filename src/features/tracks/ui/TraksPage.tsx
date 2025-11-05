import {useFetchTracksInfiniteQuery} from "@/features/tracks/api/tracksApi.ts";
import {useInfiniteScroll} from "@/common/hooks";
import {TracksList} from "@/features/tracks/ui/TraksList/TracksList.tsx";
import {LoadingTrigger} from "@/features/tracks/ui/LoadingTrigger/LoadingTrigger.tsx";

export const TracksPage = () => {

    const {data,hasNextPage,isFetching,fetchNextPage,isFetchingNextPage} = useFetchTracksInfiniteQuery()
    const pages = data?.pages.flatMap(page => page.data) || []

    const {observerRef} = useInfiniteScroll({fetchNextPage,hasNextPage,isFetching})

    return (
        <div>
            <h1>Tracks page</h1>
                <TracksList tracks={pages}/>
                <LoadingTrigger observerRef={observerRef} isFetchingNextPage={isFetchingNextPage}/>
                {!hasNextPage && pages.length > 0 && <p>Nothing more to load</p>}

        </div>
    )
}