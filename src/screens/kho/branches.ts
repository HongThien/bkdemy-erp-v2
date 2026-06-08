// Binding nhánh → component bản đồ dùng chung. Khác nhau chỉ ở nhãn + có/không mức độ + nguồn data.
import * as api from '../../lib/kho/api'
import type { MapRow, LyThuyet } from '../../lib/kho/api'

export type BranchConfig = {
  key: 'dai' | 'hinh'
  labels: { t1: string; t2: string; leaf: string }  // tầng1 / tầng2 / lá
  hasMucDo: boolean
  countLabel: string                                 // 'câu' (Đại) | 'ý' (Hình)
  chuan?: number                                     // chuẩn số câu/dạng (Đại=50); undefined = chưa áp
  list: (khoi: string) => Promise<MapRow[]>
  count: () => Promise<Record<string, number>>
  create: (row: MapRow) => Promise<void>
  updateLeaf: (leafMa: string, patch: { leafTen: string; bac: string; mucDo: number | null }) => Promise<void>
  deleteLeaf: (leafMa: string) => Promise<void>
  deleteLeaves: (leafMas: string[]) => Promise<void>   // xoá cả cụm (chủ đề/chuyên đề)
  lyThuyet?: {                                        // 1 lý thuyết/dạng (Đại); undefined = nhánh chưa có
    list: () => Promise<Record<string, LyThuyet>>
    upsert: (leafMa: string, noiDung: string, fileUrl: string | null, tenFile: string | null) => Promise<void>
    remove: (leafMa: string) => Promise<void>
  }
}

export const daiBranch: BranchConfig = {
  key: 'dai',
  labels: { t1: 'Chủ đề', t2: 'Chuyên đề', leaf: 'Dạng' },
  hasMucDo: true,
  countLabel: 'câu',
  chuan: api.CHUAN_SO_CAU,
  list: api.listDaiMap,
  count: api.countCauByDang,
  create: api.createDaiMap,
  updateLeaf: api.updateDaiLeaf,
  deleteLeaf: api.deleteDaiLeaf,
  deleteLeaves: api.deleteDaiLeaves,
  lyThuyet: {
    list: api.listDaiLyThuyet,
    upsert: api.upsertDaiLyThuyet,
    remove: api.deleteDaiLyThuyet,
  },
}

export const hinhBranch: BranchConfig = {
  key: 'hinh',
  labels: { t1: 'Mảng', t2: 'Loại câu hỏi', leaf: 'Dạng hình' },
  hasMucDo: false,
  countLabel: 'ý',
  list: api.listHinhMap,
  count: api.countYByDangHinh,
  create: api.createHinhMap,
  updateLeaf: (leafMa, patch) => api.updateHinhLeaf(leafMa, { leafTen: patch.leafTen, bac: patch.bac }),
  deleteLeaf: api.deleteHinhLeaf,
  deleteLeaves: api.deleteHinhLeaves,
}
