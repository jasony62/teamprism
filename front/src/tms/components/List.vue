<template>
    <div id="tms-list">
        <!-- <ul>
            <li
                v-for="item in items"
                :key="item.id"
            >
                <slot
                    name="item"
                    :item="item"
                ></slot>
            </li>
        </ul> -->
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
            <template v-slot:loading>
                <van-loading type="spinner" size="20" />
            </template>
            <van-cell
                v-for="item in list"
                :key="item"
                :title="item"
            />
        </van-list>
    </div>
</template>
<script>
import { List } from "vant";
export default {
    props: {
        items: Array
    },
    components: {
        [List.name]: List
    },
    data() {
        return {
            loading: false,
            finished: false
        };
    },
    methods: {
        onLoad: function() {
            // 异步更新数据
            setTimeout(() => {
                for (let i = 0; i < 10; i++) {
                    this.items.push(this.items.length + 1);
                }
                // 加载状态结束
                this.loading = false;

                // 数据全部加载完成
                if (this.items.length >= 40) {
                    this.finished = true;
                }
            }, 500);
        }
    }
};
</script>
<style scoped>
</style>