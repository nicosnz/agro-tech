import { Modal } from "@/shared/ui/modal/Modal";
import { useRegistrarPesaje } from "../model/useRegistrarPesaje";
import { PasoIngresarPeso } from "./PasoIngresarPeso";
import { PasoSeleccionPotrero } from "@/entities/potrero/ui/pasoSeleccion/PasoSeleccionPotrero";
import { PasoSeleccionLote } from "@/entities/lote/ui/pasoSeleccion/PasoSeleccionLote";
import { PasoSeleccionBovino } from "@/entities/bovino/ui/pasoSeleccionBovino/PasoSeleccionBovino";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ModalRegistrarPesaje = ({ isOpen, onClose, onSuccess }: Props) => {
  const {
    paso,
    potreros,
    loadingPotreros,
    potreroSeleccionado,
    loteSeleccionado,
    bovinoSeleccionado,
    formData,
    setFormData,
    seleccionarPotrero,
    seleccionarLote,
    seleccionarBovino,
    anterior,
    reset,
    submit,
    submitting,
  } = useRegistrarPesaje();

  const handleClose = () => {
    reset();
    onClose();
  };

  const subtitulos: Record<number, string> = {
    1: "Seleccioná un potrero",
    2: potreroSeleccionado?.nombre ?? "",
    3: `${potreroSeleccionado?.nombre} › ${loteSeleccionado?.nombre}`,
    4: `${potreroSeleccionado?.nombre} › ${loteSeleccionado?.nombre}`,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onAnterior={paso > 1 ? anterior : undefined}
      title="Registrar pesaje"
      subtitle={subtitulos[paso]}
    >
      {paso === 1 && (
        <PasoSeleccionPotrero
          potreros={potreros}
          loading={loadingPotreros}
          onSelect={seleccionarPotrero}
        />
      )}
      {paso === 2 && potreroSeleccionado && (
        <PasoSeleccionLote
          potrero={potreroSeleccionado}
          onSelect={seleccionarLote}
        />
      )}
      {paso === 3 && loteSeleccionado && (
        <PasoSeleccionBovino
          lote={loteSeleccionado}
          onSelect={seleccionarBovino}
        />
      )}
      {paso === 4 && bovinoSeleccionado && (
        <PasoIngresarPeso
          bovino={bovinoSeleccionado}
          peso={formData.peso}
          onPesoChange={(valor) => setFormData({ peso: valor })}
          onConfirmar={async () => { const ok = await submit(); if (ok) { handleClose(); onSuccess?.(); } }}
          onCancelar={handleClose}
          submitting={submitting}
        />
      )}
    </Modal>
  );
};
