import { calcularEdad } from '@/shared/lib/calcularEdad';
import { VariacionPeso } from '@/entities/pesaje/ui/variacionPeso/VariacionPeso';
import type { Bovino } from '@/entities/bovino/model/types';
import styles from './PesajeCard.module.css';
import { numericId } from '@/shared/lib/toNumericId';
import { formatFecha } from '@/shared/lib/formatFecha';

interface Props {
  bovino: Bovino;
}





const rowVariant = (bovino: Bovino) => {
  if (!bovino.peso_actual || !bovino.peso_anterior) return '';
  const diff = parseFloat(bovino.peso_actual.peso) - parseFloat(bovino.peso_anterior.peso);
  if (diff > 0) return styles['pesaje-card--sube'];
  if (diff < 0) return styles['pesaje-card--baja'];
  return '';
};

export const PesajeCard = ({ bovino }: Props) => (
  <div className={`${styles['pesaje-card']} ${rowVariant(bovino)}`}>
    <div className={styles['pesaje-card__header']}>
      <span className={styles['pesaje-card__id']}>{numericId(bovino.id)}</span>
      <span className={styles['pesaje-card__raza']}>{bovino.raza} · {calcularEdad(bovino.fecha_nacimiento)}</span>
    </div>

    <div className={styles['pesaje-card__stats']}>
      <div className={styles['pesaje-card__stat']}>
        <span className={styles['pesaje-card__stat-label']}>Peso actual</span>
        <span className={`${styles['pesaje-card__stat-value']} ${styles['pesaje-card__stat-value--peso']}`}>
          {bovino.peso_actual ? `${bovino.peso_actual.peso} kg` : '—'}
        </span>
      </div>
      <div className={styles['pesaje-card__stat']}>
        <span className={styles['pesaje-card__stat-label']}>Peso anterior</span>
        <span className={styles['pesaje-card__stat-value']}>
          {bovino.peso_anterior ? `${bovino.peso_anterior.peso} kg` : '—'}
        </span>
      </div>
    </div>

    <div className={styles['pesaje-card__footer']}>
      <VariacionPeso actual={bovino.peso_actual} anterior={bovino.peso_anterior} />
      <span className={styles['pesaje-card__fecha']}>
        {bovino.peso_actual ? formatFecha(bovino.peso_actual.fecha_pesaje) : '—'}
      </span>
    </div>
  </div>
);
