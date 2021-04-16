
module.exports = {
    name: 'getter',
    data() {
        return {           
            loading: false,
            image: '',
            output: ''
        }
    },
    template: `           
<v-container fluid class="ma-2">   
    <ext-loading absolute :show="loading"></ext-loading>
    <v-row height="40" >
        <v-toolbar flat >
            <v-text-field type="text" :value="image" outline readonly label="Image">
                <template v-slot:append-outer>
                    <v-btn elevation="2" @click="openFile" text >Select...</v-btn>
                </template>
            </v-text-field>
        </v-toolbar>
    </v-row>
    <v-row>
        <v-col>
            <ext-editor v-model="output" readonly>
            </ext-editor>
        </v-col>
    </v-row>  
</v-container>
          
`,
    methods: {
        async openFile() {
            const fileData = await this.$openImageFile('Open file');

            if (fileData) {
                this.loading = true;

                this.image = fileData.file;

                const result = await this.$extInvoke('ext.app.other.image-base64.encode', fileData);

                if (result.success) {
                    const input = result.output;
                    const result2 = await this.$extInvoke('ext.app.misc.image-exif.get', input);

                    if (result2.success) {
                        this.output = result2.output;
                    }
                    else {
                        this.output = '';
                        this.$store.dispatch("showSnackbar", result2.message);
                    }
                } else {                  
                    this.output = '';
                    this.$store.dispatch("showSnackbar", result.message);
                }

                this.loading = false;
            } else {
                this.image = '';               
                this.output = '';
            }

        },
       
    }
}