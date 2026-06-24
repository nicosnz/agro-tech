import { calcularEdad } from '@/shared/lib/calcularEdad';
import { BadgeEstado } from '@/entities/bovino/ui/badgeEstado/BadgeEstado';
import { BadgeLote } from '@/entities/bovino/ui/badgeLote/BadgeLote';
import type { Bovino } from '@/entities/bovino/model/types';
import styles from './BovinoCard.module.css';
import { numericId } from '@/shared/lib/toNumericId';

interface Props {
  bovino: Bovino;
  onVerMas?: (bovino: Bovino) => void;
}



export const BovinoCard = ({ bovino, onVerMas }: Props) => (
  <div className={styles['bovino-card']}>
    <div className={styles['bovino-card__header']}>
      <span className={styles['bovino-card__id']}>{numericId(bovino.id)}</span>
      <BadgeEstado estado={bovino.estado_actual.estado} />
    </div>

    <div className={styles['bovino-card__meta']}>
      <BadgeLote lote={bovino.lote.nombre} />
      <span className={styles['bovino-card__raza']}>{bovino.raza}</span>
    </div>

    <div className={styles['bovino-card__stats']}>
      <div className={styles['bovino-card__stat']}>
        <span className={styles['bovino-card__stat-label']}>Edad</span>
        <span className={styles['bovino-card__stat-value']}>{calcularEdad(bovino.fecha_nacimiento)}</span>
      </div>
      <div className={styles['bovino-card__stat']}>
        <span className={styles['bovino-card__stat-label']}>Peso</span>
        <span className={styles['bovino-card__stat-value']}>
          {bovino.peso_actual ? `${bovino.peso_actual.peso} kg` : '—'}
        </span>
      </div>
    </div>

    <div className={styles['bovino-card__footer']}>
      <button className={styles['bovino-card__ver-btn']} onClick={() => onVerMas?.(bovino)}>
        Ver más →
      </button>
    </div>
  </div>
);
