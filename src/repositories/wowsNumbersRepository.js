import { replaceInText } from '@/helpers';
import axios from '@/plugins/axios';

class WnRepository {
    url = 'https://api.mowe-wows-clan.eu/wows/pr/expected';

    async fetchExpectedStats() {
        return await axios.get(replaceInText(this.url, ['{prefix}', '{path}'], ['api.', '/personal/rating/expected/json/']))
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

export default function createWnRepository() {
    return new WnRepository();
}
