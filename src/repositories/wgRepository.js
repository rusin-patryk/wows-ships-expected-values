import { replaceInText } from '@/helpers';
import axios from '@/plugins/axios';

class WgRepository {
    url = `https://api.worldofwarships.${ process.env.VUE_APP_WARGAMING_SERVER || 'eu' }/wows{path}?application_id=${ process.env.VUE_APP_WARGAMING_ID }`;

    async fetchWarships(page = 1) {
        return await axios.get(replaceInText(this.url, '{path}', '/encyclopedia/ships/'), {params: {page_no: page}})
            .then((response) => {
                if (response && response.data) {
                    return response.data;
                } else {
                    return false;
                }
            })
            .catch(() => {
                return false;
            });
    }
}

export default function createWgRepository() {
    return new WgRepository();
}
