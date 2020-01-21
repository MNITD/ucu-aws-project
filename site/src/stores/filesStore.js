import {writable} from 'svelte/store'

const createStore = () => {
  const {subscribe, update} = writable({ids: [], byId: {}})

  return {
    subscribe,
    loadFiles: (files) => update(state => ({
      ids: files.map(f => f.fileId),
      byId: files.reduce((acc, f) => ({...acc, [f.fileId]: {...acc[f.fileId], ...f}}), state.byId),
    })),
    addFileUrl: (file) => update(state => ({
      ...state,
      byId: {
        ...state.byId,
        [file.fileId]: {
          ...state.byId[file.fileId],
          url: `data:image/${file.name.split('.').reverse()[0]};base64,${file.file}`,
        },
      },
    })),
  }
}

export const fileStore = createStore()
