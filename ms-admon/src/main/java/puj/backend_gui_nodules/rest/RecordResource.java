package puj.backend_gui_nodules.rest;

import puj.backend_gui_nodules.model.RecordCompleteDTO;
import puj.backend_gui_nodules.model.RecordDTO;
import puj.backend_gui_nodules.service.RecordService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
@RequestMapping(value = "/api-ms-admon/registros", produces = MediaType.APPLICATION_JSON_VALUE)
public class RecordResource {

    private final RecordService recordService;

    public RecordResource(final RecordService recordService) {
        this.recordService = recordService;
    }

    @GetMapping
    public ResponseEntity<List<RecordCompleteDTO>> getAllRegistros() {
        return ResponseEntity.ok(recordService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecordDTO> getRegistro(@PathVariable final Integer id) {
        return ResponseEntity.ok(recordService.get(id));
    }

    @GetMapping("/byUuid/{uuid}")
    public ResponseEntity<RecordCompleteDTO> getRegistroByUuid(@PathVariable final String uuid) {
        return ResponseEntity.ok(recordService.getByUuid(uuid));
    }

    @PostMapping
    public ResponseEntity<Integer> createRegistro(
            @RequestBody @Valid final RecordDTO recordDTO) {
        final Integer createdId = recordService.create(recordDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateRegistro(@PathVariable final Integer id,
            @RequestBody @Valid final RecordDTO recordDTO) {
        recordService.update(id, recordDTO);
        return ResponseEntity.ok(id);
    }

    @PutMapping("/updateStatus/{uuid}/{tipoRegistro}")
    public ResponseEntity<Integer> updateStatusRegistro(@PathVariable final String uuid, @PathVariable final Integer tipoRegistro) {
        recordService.updateStatus(uuid, tipoRegistro);
        return ResponseEntity.ok(1);
    }

    @PutMapping("/updateSeenStatus/{uuid}/{seen}")
    public ResponseEntity<Integer> updateStatusRegistro(@PathVariable final String uuid, @PathVariable final Boolean seen) {
        recordService.updateSeenStatus(uuid, seen);
        return ResponseEntity.ok(1);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegistro(@PathVariable final Integer id) {
        recordService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
