import { useState, useEffect } from "react";
import { tipoAlimentoApi } from "@/entities/tipoAlimento/api/tipoAlimentoApi";
import type { TipoAlimento } from "@/entities/tipoAlimento/model/types";
import type { Lote } from "@/entities/lote/model/types";
import styles from "./pasoIngresarAlimentacion.module.css";

interface FormData {
  id_tipo_alimento: string;
  cantidad: string;
  observacion: string;
}

interface Props {
  lote: Lote;
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
  onConfirmar: () => void;
  onCancelar: () => void;
  submitting: boolean;
  error:string | null
}

export const PasoIngresarAlimentacion = ({ lote, formData, onChange, onConfirmar, onCancelar, submitting ,error}: Props) => {
  const [alimentos, setAlimentos] = useState<TipoAlimento[]>([]);

  useEffect(() => {
    tipoAlimentoApi.getAll().then(setAlimentos);
  }, []);

  const valido = formData.id_tipo_alimento !== "" && formData.cantidad !== "" && parseFloat(formData.cantidad) > 0;

  return (
    <div className={styles["paso-alimentacion"]}>
      <div className={styles["paso-alimentacion__lote"]}>
        <span className={styles["paso-alimentacion__lote-label"]}>Lote seleccionado</span>
        <span className={styles["paso-alimentacion__lote-nombre"]}>{lote.nombre}</span>
      </div>

      <div className={styles["paso-alimentacion__campo"]}>
        <label className={styles["paso-alimentacion__label"]}>Tipo de alimento</label>
        <select
          className={styles["paso-alimentacion__select"]}
          value={formData.id_tipo_alimento}
          onChange={(e) => onChange({ id_tipo_alimento: e.target.value })}
        >
          <option value="">Seleccioná un alimento...</option>
          {alimentos.filter((a) => a.disponible).map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre} — {a.cantidad_restante} kg disponibles
            </option>
          ))}
        </select>
      </div>

      <div className={styles["paso-alimentacion__campo"]}>
        <label className={styles["paso-alimentacion__label"]}>Cantidad (kg)</label>
        <div className={styles["paso-alimentacion__input-wrapper"]}>
          <input
            type="number"
            min="0"
            placeholder="0"
            className={styles["paso-alimentacion__input"]}
            value={formData.cantidad}
            onChange={(e) => onChange({ cantidad: e.target.value })}
          />
          <span className={styles["paso-alimentacion__unidad"]}>kg</span>
        </div>
      </div>

      <div className={styles["paso-alimentacion__campo"]}>
        <label className={styles["paso-alimentacion__label"]}>Observación <span className={styles["paso-alimentacion__opcional"]}>(opcional)</span></label>
        <textarea
          className={styles["paso-alimentacion__textarea"]}
          placeholder="Ej: suplemento post-lluvia..."
          value={formData.observacion}
          onChange={(e) => onChange({ observacion: e.target.value })}
          rows={3}
        />
      </div>
      {error && <p className={styles["paso-alimentacion__error"]}>{error}</p>}

      <div className={styles["paso-alimentacion__acciones"]}>
        <button className={styles["paso-alimentacion__btn-cancelar"]} onClick={onCancelar}>
          Cancelar
        </button>
        <button
          className={`${styles["paso-alimentacion__btn-confirmar"]} ${valido ? styles["paso-alimentacion__btn-confirmar--activo"] : ""}`}
          onClick={onConfirmar}
          disabled={!valido || submitting}
        >
          {submitting ? "Guardando..." : "Confirmar"}
        </button>
      </div>
    </div>
  );
};
