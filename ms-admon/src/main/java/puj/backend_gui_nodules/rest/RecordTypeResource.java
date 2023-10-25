package puj.backend_gui_nodules.rest;

import puj.backend_gui_nodules.model.RecordTypeDTO;
import puj.backend_gui_nodules.service.RecordTypeService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/api-ms-admon/tipoRegistros")
public class RecordTypeResource {

    private final RecordTypeService recordTypeService;

    public RecordTypeResource(final RecordTypeService recordTypeService) {
        this.recordTypeService = recordTypeService;
    }

    @GetMapping
    public ResponseEntity<List<RecordTypeDTO>> getAllTipoRegistros() {
        return ResponseEntity.ok(recordTypeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecordTypeDTO> getTipoRegistro(@PathVariable final Integer id) {
        return ResponseEntity.ok(recordTypeService.get(id));
    }

    @PostMapping
    public ResponseEntity<Integer> createTipoRegistro(
            @RequestBody @Valid final RecordTypeDTO recordTypeDTO) {
        final Integer createdId = recordTypeService.create(recordTypeDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateTipoRegistro(@PathVariable final Integer id,
            @RequestBody @Valid final RecordTypeDTO recordTypeDTO) {
        recordTypeService.update(id, recordTypeDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTipoRegistro(@PathVariable final Integer id) {
        recordTypeService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
