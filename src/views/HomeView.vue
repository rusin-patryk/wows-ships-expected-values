<template>
    <div class="home">
        <div class="text-h4 text-center">Personal Rating - expected values per ship</div>
        <v-divider inset />
        <div class="body-2 text-center mt-6">The Personal Rating is measure of skill in World of Warships. It measures performance in every warship and compares it to certain expected values. Differences between actual and expected values are used to calculate final Personal Rating value. Elements in order of importance: damage dealt, warship kills, win rate.</div>
        <div class="body-2 text-center mt-3">Expected values data comes from <a href="https://wows-numbers.com/"
                                                                                target="_blank">wows-numbers.com</a> (<a
            href="https://api.wows-numbers.com/personal/rating/expected/json/"
            target="_blank">json URL</a>). You can read about Personal Rating formula
            <a href="https://wows-numbers.com/personal/rating/" target="_blank">here</a>.
        </div>
        <div class="body-2 text-center mt-3">The data is refreshed every few days.
            <v-btn
                outlined
                x-small
                @click="refresh"
            >
                <v-icon class="mr-1" small>mdi-refresh</v-icon>
                refresh now
            </v-btn>
        </div>
        <v-skeleton-loader
            v-if="loading"
            class="mx-auto mt-8"
            type="table"
        />
        <v-data-table
            v-else
            :footer-props="{ 'items-per-page-options': [10, 25, 50, 100, -1]}"
            :headers="headers"
            :items="warships"
            :items-per-page="10"
            class="elevation-1 mt-8"
            item-key="ship_id"
        >
            <template v-slot:top>
                <div class="mx-2 pt-5 pb-3">
                    <v-row no-gutters>
                        <v-col
                            cols="12"
                            lg="3"
                            sm="6"
                            xs="12"
                        >
                            <v-text-field
                                v-model="search"
                                class="mx-2"
                                dense
                                label="Ship name"
                            />
                        </v-col>
                        <v-col
                            cols="12"
                            lg="3"
                            sm="6"
                            xs="12"
                        >
                            <v-select
                                v-model="selectedTiers"
                                :items="tiers"
                                class="mx-2"
                                clearable
                                dense
                                label="Tier"
                                multiple
                            />
                        </v-col>
                        <v-col
                            cols="12"
                            lg="3"
                            sm="6"
                            xs="12"
                        >
                            <v-select
                                v-model="selectedNations"
                                :items="nations"
                                class="mx-2"
                                clearable
                                dense
                                label="Nations"
                                multiple
                            >
                                <template v-slot:item="{ item, index }">
                                    <v-img v-if="getNationFlag(item)"
                                           :lazy-src="getNationFlag(item)"
                                           :src="getNationFlag(item)"
                                           class="mr-2 mb-1"
                                           contain
                                           height="22"
                                           max-width="32" />
                                    <span>{{ item }}</span>
                                </template>
                                <template v-slot:selection="{ item, index }">
                                    <v-img v-if="getNationFlag(item)"
                                           :lazy-src="getNationFlag(item)"
                                           :src="getNationFlag(item)"
                                           class="mr-1 mb-1"
                                           contain
                                           height="22"
                                           max-width="32" />
                                    <span v-else>{{ item }}</span>
                                </template>
                            </v-select>
                        </v-col>
                        <v-col
                            cols="12"
                            lg="3"
                            sm="6"
                            xs="12"
                        >
                            <v-select
                                v-model="selectedTypes"
                                :items="types"
                                class="mx-2"
                                clearable
                                dense
                                label="Types"
                                multiple
                            >
                                <template v-slot:item="{ item, index }">
                                    <v-img v-if="getShipTypeIcon(item)"
                                           :lazy-src="getShipTypeIcon(item)"
                                           :src="getShipTypeIcon(item)"
                                           class="mr-2 mb-1"
                                           height="22"
                                           max-width="30" />
                                    <span>{{ item }}</span>
                                </template>
                                <template v-slot:selection="{ item, index }">
                                    <v-img v-if="getShipTypeIcon(item)"
                                           :lazy-src="getShipTypeIcon(item)"
                                           :src="getShipTypeIcon(item)"
                                           class="mb-1"
                                           height="22"
                                           max-width="30" />
                                    <span v-else>{{ item }}</span>
                                </template>
                            </v-select>
                        </v-col>
                    </v-row>
                </div>
                <v-divider />
            </template>
            <template v-slot:item.name="{ item }">
                <div class="d-flex align-center">
                    <v-img :lazy-src="item.images.small"
                           :src="item.images.small"
                           class="mr-3 mb-1"
                           contain
                           max-width="110" />
                    {{ item.name }}
                    <v-tooltip v-if="item.is_special" bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon class="ml-1" small v-bind="attrs" v-on="on">mdi-star-outline</v-icon>
                        </template>
                        <span>Special ship</span>
                    </v-tooltip>
                    <v-tooltip v-if="item.is_premium" bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon class="ml-1" small v-bind="attrs" v-on="on">mdi-star</v-icon>
                        </template>
                        <span>Premium ship</span>
                    </v-tooltip>
                </div>
            </template>
            <template v-slot:item.average_win_rate="{ item }">
                {{ item.average_win_rate }}%
            </template>
            <template v-slot:item.nation="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-img v-if="getNationFlag(item.nation)"
                               :lazy-src="getNationFlag(item.nation)"
                               :src="getNationFlag(item.nation)"
                               class="mr-3 mb-1"
                               contain
                               v-bind="attrs"
                               width="30"
                               v-on="on" />
                        <span v-else>{{ item.nation }}</span>
                    </template>
                    <span>{{ item.nation }}</span>
                </v-tooltip>
            </template>
            <template v-slot:item.type="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-img v-if="getShipTypeIcon(item.type)"
                               :class="{'reverse-color': !$vuetify.theme.dark}"
                               :lazy-src="getShipTypeIcon(item.type)"
                               :src="getShipTypeIcon(item.type)"
                               class="mr-3 mb-1"
                               contain
                               v-bind="attrs"
                               width="30"
                               v-on="on" />
                        <span v-else>{{ item.type }}</span>
                    </template>
                    <span>{{ item.type }}</span>
                </v-tooltip>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import createWgRepository from '@/repositories/wgRepository';
import createWnRepository from '@/repositories/wowsNumbersRepository';
import { getNationFlag, getShipTypeIcon, normalizeRequest } from '@/helpers';

export default {
    name: 'HomeView',
    data: () => {
        return {
            search: '',
            wgRepository: createWgRepository(),
            wnRepository: createWnRepository(),
            warships: undefined,
            warshipsStats: undefined,
            loading: true,
            tiers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            selectedTiers: [],
            nations: ['commonwealth', 'europe', 'france', 'germany', 'italy', 'japan', 'netherlands', 'pan_america', 'pan_asia', 'spain', 'uk', 'usa', 'ussr'],
            selectedNations: [],
            types: ['AirCarrier', 'Battleship', 'Cruiser', 'Destroyer'],
            selectedTypes: [],
        };
    },
    computed: {
        headers() {
            return [{
                text: 'Name',
                value: 'name',
                filter: (value) => {
                    if (!this.search) return true;
                    return normalizeRequest(value).indexOf(normalizeRequest(this.search)) >= 0;
                },
            }, {
                text: 'Tier',
                value: 'tier',
                filter: (value) => {
                    if (!this.selectedTiers.length) return true;
                    return this.selectedTiers.includes(value);
                },
            }, {
                text: 'Avg DMG',
                value: 'average_damage_dealt',
            }, {
                text: 'Avg frags',
                value: 'average_frags',
            }, {
                text: 'Avg WR',
                value: 'average_win_rate',
            }, {
                text: 'Nation',
                value: 'nation',
                filter: (value) => {
                    if (!this.selectedNations.length) return true;
                    return this.selectedNations.includes(value);
                },
            }, {
                text: 'Type',
                value: 'type',
                filter: (value) => {
                    if (!this.selectedTypes.length) return true;
                    return this.selectedTypes.includes(value);
                },
            }];
        },
    },
    beforeMount() {
        this.getShips(true);
    },
    methods: {
        async getShips(firstRun = false, page = 1) {
            const shipCache = localStorage.getItem('warships');
            const cacheExpired = localStorage.getItem('cache_expired');
            if (cacheExpired && parseInt(cacheExpired, 10) > Date.now() && shipCache && shipCache.length) {
                this.warships = JSON.parse(shipCache);
                this.loading = false;
                return;
            }
            const shipsResponse = await this.wgRepository.fetchWarships(page);
            if (firstRun) {
                this.warships = [];
                this.warshipsStats = await this.wnRepository.fetchExpectedStats();
            }
            const stats = this.warshipsStats;
            if (!shipsResponse.data) {
                alert('Wargaming API Error');
                this.loading = false;
                return;
            }
            if (!stats.data) {
                alert('Wows-Numbers.com API Error');
                this.loading = false;
                return;
            }
            Object.keys(shipsResponse.data).forEach((key) => {
                if (shipsResponse.data[key] && shipsResponse.data[key].ship_id && stats.data[key]) {
                    if (stats.data[key].average_damage_dealt && stats.data[key].average_frags && stats.data[key].win_rate) {
                        shipsResponse.data[key].average_damage_dealt = stats.data[key].average_damage_dealt.toFixed() || 0;
                        shipsResponse.data[key].average_frags = stats.data[key].average_frags.toFixed(2) || 0;
                        shipsResponse.data[key].average_win_rate = stats.data[key].win_rate.toFixed(2) || 0;
                        this.warships.push(shipsResponse.data[key]);
                    }
                }
            });
            if (shipsResponse.meta.page < shipsResponse.meta.page_total) {
                this.getShips(firstRun = false, ++shipsResponse.meta.page);
                return;
            }
            localStorage.setItem('cache_expired', (Date.now() + 604800000).toString());
            localStorage.setItem('warships', JSON.stringify(this.warships));
            this.loading = false;
        },
        refresh() {
            this.loading = true;
            localStorage.removeItem('cache_expired');
            localStorage.removeItem('warships');
            this.getShips(true);
        },
        getNationFlag(nation) {
            return getNationFlag(nation);
        },
        getShipTypeIcon(type) {
            return getShipTypeIcon(type);
        },
    },
};
</script>

<style scoped>
.reverse-color {
    background-color: #646464;
}
</style>
