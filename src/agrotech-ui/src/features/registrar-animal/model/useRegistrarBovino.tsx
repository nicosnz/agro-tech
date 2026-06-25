import { useState, useEffect } from "react";
import { loteApi } from "@/entities/lote/api/loteApi";
import { bovinoApi } from "@/entities/bovino/api/bovinoApi";
import type { Lote } from "@/entities/lote/model/types";
import type { BovinoRequest, SexoBovino, RazaBovino, OrigenBovino, BovinoIds } from "@/entities/bovino/model/types";

interface FormData {
  sexo:             SexoBovino | "";
  raza:             RazaBovino | "";
  fecha_nacimiento: string;
  origen:           OrigenBovino | "";
  id_lote:          string;
  id_madre:         string;
  id_padre:         string;
}

const formInicial: FormData = {
  sexo:             "",
  raza:             "",
  fecha_nacimiento: "",
  origen:           "",
  id_lote:          "",
  id_madre:         "",
  id_padre:         "",
};

export const useRegistrarBovino = () => {
  const [lotes, setLotes]           = useState<Lote[]>([]);
  const [loadingLotes, setLoadingLotes] = useState(false);
  const [loadingMachos, setLoadingMachos] = useState(false);
  const [loadingHembras, setLoadingHembras] = useState(false);
  const [formData, setFormData]     = useState<FormData>(formInicial);
  const [submitting, setSubmitting] = useState(false);
  const [bovinosMachos, setBovinosMachos] = useState<BovinoIds[]>([])
  const [bovinosHembras, setBovinosHembras] = useState<BovinoIds[]>([])

  useEffect(() => {
    setLoadingLotes(true);
    loteApi.getAll()
      .then(setLotes)
      .finally(() => setLoadingLotes(false));
  }, []);

  useEffect(() => {
    setLoadingHembras(true);
    bovinoApi.getHembras()
      .then(setBovinosHembras)
      .finally(() => setLoadingHembras(false));
  }, []);
  
  useEffect(() => {
    setLoadingMachos(true);
    bovinoApi.getMachos()
      .then(setBovinosMachos)
      .finally(() => setLoadingMachos(false));
  }, []);
  

  const reset = () => setFormData(formInicial);

  const submit = async (): Promise<boolean> => {
    const { sexo, raza, origen, fecha_nacimiento, id_lote, id_madre, id_padre } = formData;
    if (!sexo || !raza || !origen || !fecha_nacimiento || !id_lote) return false;
    if (origen === "Nacimiento propio" && (!id_madre || !id_padre)) return false;
    setSubmitting(true);
    try {
      const body: BovinoRequest = {
        sexo,
        raza,
        fecha_nacimiento,
        origen,
        id_lote,
        id_madre: formData.id_madre || null,
        id_padre: formData.id_padre || null,
      };
      await bovinoApi.postBovino(body);
      return true;
    } catch {
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { lotes, loadingLotes, formData, setFormData, reset, submit, submitting ,loadingHembras,loadingMachos,bovinosHembras,bovinosMachos};
};
