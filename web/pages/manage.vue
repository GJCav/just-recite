<template>
<v-container>
  <v-row>
    <p class="text-h4 text-sm-h3 mt-4">Archive Management</p>
  </v-row>

  <v-row>
    <input ref="file_input" class="d-none" type="file" @change="file_change"/>
    <v-btn color="primary" @click="choose_file">New</v-btn>
  </v-row>

  <v-row>
    <v-col
      v-for="name in archive_list" :key="name"
      :cols="12" :sm="6" :lg="4"
    >
      <ArchiveCard :name="name"></ArchiveCard>
    </v-col>
  </v-row>
</v-container>
</template>


<script>
import { open_app_data } from '~/utils/db';
import { read_file } from '~/utils/io';
import { from_plain_text } from '~/utils/parser';

let watch_archive_list = null;
let app_data;

export default {
    name: "ManagePage",
    
    data: () => ({
        test: [1, 2, 3, 4, 5],
        archive_list: []
    }),


    mounted() {
      open_app_data().then((_app) => {
        app_data = _app;
        watch_archive_list = app_data.watch_archive_list();
        watch_archive_list.subscribe({
          next: r => { this.archive_list = r ? r.value : []; },
          error: e => { 
            // console.log(e); // TODO: use error dialog here.
            throw(e); // unknown error, unable to recover
          }
        })
      })
    },

    unmounted() {
      if (watch_archive_list) {
        watch_archive_list.unsubscribe();
        watch_archive_list = null;
      }
    },

    methods: {
      choose_file() {
        this.$refs.file_input.click();
      },

      async file_change() {
        try {
          const files = this.$refs.file_input.files;
          if (files.length <= 0) {
            return;
          }

          const text = await read_file(files[0]);
          const dic = from_plain_text(text);
          dic.meta.name = files[0].name;

          const app_data = await open_app_data();
          await app_data.create_archive({
            name: files[0].name,
            dic
          });

          // TODO: recover from error here.
        } finally {
          this.$refs.file_input.value = null;
        }
      },
    },
    
}
</script>