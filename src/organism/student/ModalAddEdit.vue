<script lang="ts" setup>
import type { StudentList } from '@/types/student';


interface Props {
  type?: 'add' | 'edit' | 'delete'
  data?: StudentList
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
})
const dialog = defineModel<boolean>()
const { type } = toRefs(props)
const id = computed(() => props.data?.id ?? '')
const route = useRoute()

const createMutation = useAddStudent()
</script>
