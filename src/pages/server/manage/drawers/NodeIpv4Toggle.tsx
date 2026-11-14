import { useEffect, useState } from 'react'
import { Switch, message } from 'antd'
import { fetchNodeIpv4Settings, saveNodeIpv4Settings } from '@/api/services/config'

/** Persisted separately from the node form; only existing nodes have an ID. */
export function NodeIpv4Toggle({ type, id }: { type: string; id?: number }) {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!id) return
    let active = true
    void fetchNodeIpv4Settings().then((data) => {
      if (active) setEnabled(Boolean(data?.[type + ':' + id]))
    }).catch(() => { if (active) message.error('读取节点 IPv4 设置失败') })
    return () => { active = false }
  }, [type, id])
  if (!id) return null
  return <div className="form-group">
    <label style={{ marginRight: 12 }}>订阅直接下发 IPv4</label>
    <Switch checked={enabled} loading={loading} disabled={loading} onChange={(checked) => {
      setLoading(true)
      void saveNodeIpv4Settings(type, id, checked).then(() => {
        setEnabled(checked)
        message.success('节点 IPv4 下发设置已保存')
      }).catch(() => message.error('保存失败')).finally(() => setLoading(false))
    }} />
    <div style={{ fontSize: 12, color: '#888' }}>关闭时保留 DDNS 域名；开启后仅解析节点连接地址，解析失败保留域名。</div>
  </div>
}
