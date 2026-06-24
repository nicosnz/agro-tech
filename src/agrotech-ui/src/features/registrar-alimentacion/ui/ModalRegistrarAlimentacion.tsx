import { Modal } from "@/shared/ui/modal/Modal";
import { PasoSeleccionPotrero } from "@/entities/potrero/ui/pasoSeleccion/PasoSeleccionPotrero";
import { PasoSeleccionLote } from "@/entities/lote/ui/pasoSeleccion/PasoSeleccionLote";
import { PasoIngresarAlimentacion } from "./PasoIngresarAlimentacion";
import { useRegistrarAlimentacion } from "../model/useRegistrarAlimentacion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ModalRegistrarAlimentacion = ({ isOpen, onClose, onSuccess }: Props) => {
  const {
    paso,
    potreros,
    loadingPotreros,
    potreroSeleccionado,
    loteSeleccionado,
    formData,
    setFormData,
    seleccionarPotrero,
    seleccionarLote,
    anterior,
    reset,
    submit,
    submitting,
    error,
  } = useRegistrarAlimentacion();

  const handleClose = () => {
    reset();
    onClose();
  };

  const subtitulos: Record<number, string> = {
    1: "Seleccioná un potrero",
    2: potreroSeleccionado?.nombre ?? "",
    3: `${potreroSeleccionado?.nombre} › ${loteSeleccionado?.nombre}`,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onAnterior={paso > 1 ? anterior : undefined}
      title="Registrar alimentación"
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
        <PasoIngresarAlimentacion
          lote={loteSeleccionado}
          formData={formData}
          onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
          onConfirmar={async () => { const ok = await submit(); if (ok) { handleClose(); onSuccess?.(); } }}
          onCancelar={handleClose}
          submitting={submitting}
          error={ error}
        />
      )}
    </Modal>
  );
};
