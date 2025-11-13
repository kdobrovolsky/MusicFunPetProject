import type {
    CreatePlaylistArgs,
    FetchPlaylistsArgs, PlaylistCreatedEvent,
    PlaylistData,
    PlaylistsResponse, PlaylistUpdatedEvent,
    UpdatePlaylistArgs
} from "@/features/playlists/api/playlistsApi.types.ts";
import {baseApi} from "@/app/api/baseApi.ts";
import type {Images} from "@/common/types";
import {playlistCreateResponseSchema, playlistsResponseSchema} from "@/features/playlists/model/playlists.schemas.ts";
import {imagesSchema} from "@/common/schemas";
import {withZodCatch} from "@/common/utils/withZodCatch.ts";
import {SOCKET_EVENTS} from "@/common/constants/constants.ts";
import {subscribeToEvent} from "@/common/socket/subscribeToEvent.ts";


export const playlistsApi = baseApi.injectEndpoints({
    endpoints: build => ({
        fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
            query: (params) => {
                return{
                    url:'playlists',
                    params
                }
            },
            ...withZodCatch(playlistsResponseSchema),
            keepUnusedDataFor: 0,
            async onCacheEntryAdded(_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                await cacheDataLoaded

                const unsubscribe = subscribeToEvent<PlaylistCreatedEvent>(
                    SOCKET_EVENTS.PLAYLIST_CREATED,
                    msg => {
                        const newPlaylist = msg.payload.data
                        updateCachedData(state => {
                            state.data.pop()
                            state.data.unshift(newPlaylist)
                            state.meta.totalCount = state.meta.totalCount + 1
                            state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize)
                        })
                    }
                )
                const unsubscribe2 = subscribeToEvent<PlaylistUpdatedEvent>(
                    SOCKET_EVENTS.PLAYLIST_UPDATED,
                    msg => {
                        const newPlaylist = msg.payload.data
                        updateCachedData(state => {
                            const index = state.data.findIndex(playlist => playlist.id === newPlaylist.id)
                            if (index !== -1) {
                                state.data[index] = { ...state.data[index], ...newPlaylist }
                            }
                        })
                    }
                )
                await cacheEntryRemoved
                unsubscribe()
                unsubscribe2()
            },
            providesTags:['Playlist']
        }),
        createPlaylists: build.mutation<{data: PlaylistData }, CreatePlaylistArgs>({
            query: (body) => ({
                method: 'POST',
                url: `playlists`,
                body
            }),
            ...withZodCatch(playlistCreateResponseSchema),
            invalidatesTags:['Playlist']
        }),
        deletePlaylist: build.mutation<void, string>({
            query: (playlistId) => ({
                method: 'DELETE',
                url: `playlists/${playlistId}`,
            }),
            invalidatesTags:['Playlist']
        }),
        updatePlaylist: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
            query: ({ playlistId, body }) => ({
                url: `playlists/${playlistId}`,
                method: 'PUT',
                body
            }),
            async onQueryStarted({ playlistId, body }, { dispatch, queryFulfilled, getState }) {
                const args = playlistsApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists')

                const patchResults: any[] = []

                args.forEach(arg => {
                    patchResults.push(
                        dispatch(
                            playlistsApi.util.updateQueryData(
                                'fetchPlaylists',
                                {
                                    pageNumber: arg.pageNumber,
                                    pageSize: arg.pageSize,
                                    search: arg.search,
                                },
                                state => {
                                    const index = state.data.findIndex(playlist => playlist.id === playlistId)
                                    if (index !== -1) {
                                        state.data[index].attributes = { ...state.data[index].attributes, ...body }
                                    }
                                }
                            )
                        )
                    )
                })

                try {
                    await queryFulfilled
                } catch {
                    patchResults.forEach(patchResult => {
                        patchResult.undo()
                    })
                }
            },
            invalidatesTags: ['Playlist'],
        }),
        uploadPlaylistCover: build.mutation<Images, { playlistId: string; file: File }>({
            query: ({ playlistId, file }) => {
                const formData = new FormData()
                formData.append('file', file)
                return {
                    url: `playlists/${playlistId}/images/main`,
                    method: 'POST',
                    body: formData,
                }
            },
            ...withZodCatch(imagesSchema),
            invalidatesTags: ['Playlist'],
        }),
        deletePlaylistCover: build.mutation<void, { playlistId: string }>({
            query: ({ playlistId }) => {
                return {
                    url: `playlists/${playlistId}/images/main`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['Playlist'],
        }),
    }),
})

export const {
    useFetchPlaylistsQuery,
    useCreatePlaylistsMutation,
    useDeletePlaylistMutation,
    useUpdatePlaylistMutation,
    useUploadPlaylistCoverMutation,
    useDeletePlaylistCoverMutation
} = playlistsApi