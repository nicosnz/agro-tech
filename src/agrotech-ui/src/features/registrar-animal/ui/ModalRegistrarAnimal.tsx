import type { FormEvent } from "react";
import { Modal } from "@/shared/ui/modal/Modal";
import { useRegistrarBovino } from "../model/useRegistrarBovino";
import type { SexoBovino, RazaBovino, OrigenBovino } from "@/entities/bovino/model/types";
import styles from "./ModalRegistrarAnimal.module.css";

interface Props {
  isOpen:     boolean;
  onClose:    () => void;
  onSuccess?: () => void;
}

const SEXOS:    SexoBovino[]   = ["Macho", "Hembra"];
const RAZAS:    RazaBovino[]   = ["Nelore", "Brangus", "Brahman"];
const ORIGENES: OrigenBovino[] = ["Comprado", "Nacimiento propio"];

export const ModalRegistrarAnimal = ({ isOpen, onClose, onSuccess }: Props) => {
  const { lotes, loadingLotes, formData, setFormData, reset, submit, submitting ,loadingHembras,loadingMachos,bovinosHembras,bovinosMachos} = useRegistrarBovino();

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await submit();
    if (ok) { handleClose(); onSuccess?.(); }
  };

  const nacimientoPropio = formData.origen === "Nacimiento propio";

  const valido =
    !!formData.sexo && !!formData.raza && !!formData.origen &&
    !!formData.fecha_nacimiento && !!formData.id_lote &&
    (!nacimientoPropio || (!!formData.id_padre && !!formData.id_madre));

  type FormData = typeof formData;
  const set = (field: keyof FormData) =>
    (e: { target: { value: string } }) =>
      setFormData((prev: FormData) => ({ ...prev, [field]: e.target.value }));

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Registrar animal">
      <form onSubmit={handleSubmit} className={styles["form-animal"]}>

        <div className={styles["form-animal__row"]}>
          <div className={styles["form-animal__campo"]}>
            <label className={styles["form-animal__label"]}>Lote</label>
            <select className={styles["form-animal__select"]} value={formData.id_lote} onChange={set("id_lote")} disabled={loadingLotes}>
              <option value="">{loadingLotes ? "Cargando..." : "Seleccioná"}</option>
              {lotes.map((lote) => <option key={lote.id} value={lote.id}>{lote.nombre}</option>)}
            </select>
          </div>

          <div className={styles["form-animal__campo"]}>
            <label className={styles["form-animal__label"]}>Fecha de nacimiento / Ingreso</label>
            <input type="date" className={styles["form-animal__input"]} value={formData.fecha_nacimiento} onChange={set("fecha_nacimiento")} />
          </div>
        </div>

        <div className={styles["form-animal__row"]}>
          <div className={styles["form-animal__campo"]}>
            <label className={styles["form-animal__label"]}>Sexo</label>
            <select className={styles["form-animal__select"]} value={formData.sexo} onChange={set("sexo")}>
              <option value="">Selecciona el sexo</option>
              {SEXOS.map((sexo) => <option key={sexo} value={sexo}>{sexo}</option>)}
            </select>
          </div>

          <div className={styles["form-animal__campo"]}>
            <label className={styles["form-animal__label"]}>Raza</label>
            <select className={styles["form-animal__select"]} value={formData.raza} onChange={set("raza")}>
              <option value="">Selecciona la raza</option>
              {RAZAS.map((raza) => <option key={raza} value={raza}>{raza}</option>)}
            </select>
          </div>
        </div>

        <div className={styles["form-animal__campo"]}>
          <label className={styles["form-animal__label"]}>Origen</label>
          <select className={styles["form-animal__select"]} value={formData.origen} onChange={set("origen")}>
            <option value="">Selecciona el origen</option>
            {ORIGENES.map((origenes) => <option key={origenes} value={origenes}>{origenes}</option>)}
          </select>
        </div>

        <div className={styles["form-animal__row"]}>
          <div className={styles["form-animal__campo"]}>
            <label className={styles["form-animal__label"]}>ID macho {!nacimientoPropio && <span className={styles["form-animal__opcional"]}>(opcional)</span>}</label>
            <select className={styles["form-animal__select"]} value={formData.id_padre} onChange={set("id_padre")} disabled={loadingMachos}>
              <option value="">{loadingMachos ? "Cargando..." : "Seleccioná"}</option>
              {bovinosMachos.map((bovinoMacho) => <option key={bovinoMacho.id} value={bovinoMacho.id}>{bovinoMacho.id}</option>)}
            </select>          
          </div>

          <div className={styles["form-animal__campo"]}>
            <label className={styles["form-animal__label"]}>ID hembra {!nacimientoPropio && <span className={styles["form-animal__opcional"]}>(opcional)</span>}</label>
            <select className={styles["form-animal__select"]} value={formData.id_madre} onChange={set("id_madre")} disabled={loadingHembras}>
              <option value="">{loadingHembras ? "Cargando..." : "Seleccioná"}</option>
              {bovinosHembras.map((bovinoHembra) => <option key={bovinoHembra.id} value={bovinoHembra.id}>{bovinoHembra.id}</option>)}
            </select>           
          </div>
        </div>

        <div className={styles["form-animal__acciones"]}>
          <button type="button" className={styles["form-animal__btn-cancelar"]} onClick={handleClose}>Cancelar</button>
          <button type="submit" className={styles["form-animal__btn-confirmar"]} disabled={!valido || submitting}>
            {submitting ? "Guardando..." : "Registrar"}
          </button>
        </div>

      </form>
    </Modal>
  );
};
