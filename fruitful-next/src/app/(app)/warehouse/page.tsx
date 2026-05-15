import { createClient } from '@/lib/supabase/server';
import type { Zone, Fruit } from '@/lib/types';

export const runtime = 'edge';

export default async function WarehousePage() {
  const supabase = await createClient();
  const [{ data: zones }, { data: fruits }] = await Promise.all([
    supabase.from('zones').select('*').order('id'),
    supabase.from('fruits').select('*'),
  ]);

  const fruitById: Record<string, Fruit> = Object.fromEntries(
    (fruits ?? []).map((f) => [f.id, f as Fruit]),
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">คลังสินค้า</h1>
          <p className="page-sub">แผนผังโซน {zones?.length ?? 0} โซน</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="zone-map">
            {(zones as Zone[] | null)?.map((z) => {
              const f = z.fruit_id ? fruitById[z.fruit_id] : null;
              const pct = Math.round((z.kg / z.cap) * 100);
              return (
                <div key={z.id} className={`zone ${z.type}`}>
                  <div className="z-id">{z.id}</div>
                  {z.temp != null && <div className="z-temp">{z.temp}°C</div>}
                  {f ? (
                    <>
                      <div className="z-fruit">{f.name}</div>
                      <div className="z-fill">
                        {z.kg.toLocaleString()} / {z.cap.toLocaleString()} กก. · {pct}%
                      </div>
                    </>
                  ) : (
                    <div className="z-fruit muted">ว่าง</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
